import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "@prisma/client";
import { UserService } from "@src/modules/user/user.service";
import { Request } from "express";
import { AuthDecoratorParams } from "./auth.decorator";
import { AuthService } from "./auth.service";

declare global {
	namespace Express {
		interface Request {
			/** User is not undefined if user has been authenticated */
			User?: User;
		}
	}
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService,
		private userService: UserService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest<Request>();
		const authDecoratorOptions = this.reflector.getAllAndOverride<
			AuthDecoratorParams | undefined
		>("authOptions", [context.getHandler(), context.getClass()]);
		if (authDecoratorOptions?.disable) return true;

		const encodedAuthToken = request.header("Cookie")?.split("auth-token=")[1];

		if (!encodedAuthToken) {
			throw new UnauthorizedException(
				"auth-token in the cookie header has to be provided. This normally happens automatically when receiving the response from the sign in route due to the Set-Cookie header."
			);
		}

		const { isAuthenticated, hasEmailConfirmation, currentUser } =
			await this.authService.getAuthState(encodedAuthToken);

		if (!isAuthenticated) {
			throw new UnauthorizedException("provided auth-token was not valid");
		}
		if (!hasEmailConfirmation && !authDecoratorOptions?.ignoreEmailConfirmation) {
			throw new UnauthorizedException("email has not been confirmed yet");
		}
		if (
			authDecoratorOptions?.roleName &&
			!this.authService.isAuthorizedForRole(currentUser!, authDecoratorOptions.roleName)
		) {
			throw new UnauthorizedException(
				`user called '${currentUser!.username}' ` +
					`with id '${currentUser!.id}' ` +
					`does not have the role '${authDecoratorOptions.roleName}' assigned`
			);
		}

		if (!!authDecoratorOptions?.strategy) {
			return authDecoratorOptions.strategy(currentUser!);
		}

		request.User = currentUser!;
		this.userService.setCurrentUser(currentUser!);

		return true;
	}
}
