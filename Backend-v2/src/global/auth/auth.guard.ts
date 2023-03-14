import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "@prisma/client";
import { Request } from "express";
import { AuthDecoratorParams } from "./auth.decorator";
import { AuthService } from "./auth.service";

declare global {
	namespace Express {
		interface Request {
			/** User is not undefined if user has been authenticated */
			User?: User
		}
	}
}

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private reflector: Reflector,
		private authService: AuthService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {

		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest<Request>();
		const args = this.reflector.getAllAndOverride<AuthDecoratorParams | undefined>("authParams", [
			context.getHandler(),
			context.getClass()
		]);

		if (args?.disable) return true;

		const encodedAuthToken = request.header("Cookie")?.split("auth-token=")[1];

		if (!encodedAuthToken) {
			throw new UnauthorizedException("Authorization token using the Bearer syntax has to be provided");
		}

		const encodedUserIdOrError = await this.authService.authorize(encodedAuthToken, args);

		if (encodedUserIdOrError instanceof HttpException) {
			throw encodedUserIdOrError;
		}

		request.User = encodedUserIdOrError;
		return true;
	}
}
