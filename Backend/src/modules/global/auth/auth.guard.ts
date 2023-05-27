import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
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
        const args = this.reflector.getAllAndOverride<AuthDecoratorParams | undefined>(
            "authParams",
            [context.getHandler(), context.getClass()]
        );

        if (args?.disable) return true;

        const encodedAuthToken = request.header("Cookie")?.split("auth-token=")[1];

        if (!encodedAuthToken) {
            throw new UnauthorizedException(
                "auth-token in the cookie header has to be provided. This normally happens automatically when receiving the response from the sign in route due to the Set-Cookie header."
            );
        }

        const encodedUserIdOrError = await this.authService.authorize(encodedAuthToken, args);

        if (encodedUserIdOrError instanceof HttpException) {
            throw encodedUserIdOrError;
        }

        request.User = encodedUserIdOrError;
        this.userService.setCurrentUser(encodedUserIdOrError);

        return true;
    }
}
