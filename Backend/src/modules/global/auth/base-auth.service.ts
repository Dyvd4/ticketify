import {
    HttpException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Config } from "@config";
import { PrismaService } from "@src/modules/global/database/prisma.service";

export interface BaseAuthParams {
    /** If set to true, checks if user is half authenticated instead of full.
     * Half authenticated means that the e-mail is not confirmed yet.
     */
    ignoreEmailConfirmation?: boolean;
}

@Injectable()
export abstract class BaseAuthService {
    private JWT_SECRET_KEY: string;

    constructor(configService: ConfigService, private prisma: PrismaService) {
        this.JWT_SECRET_KEY = configService.get<Config>("JWT_SECRET_KEY", { infer: true });
    }

    private getEncodedUserId(decodedAuthToken: string): string {
        const decoded = jwt.verify(decodedAuthToken, this.JWT_SECRET_KEY) as {
            data: { userId: string };
        };
        return decoded.data.userId;
    }

    /**
     * @returns
     * - User is authentication passes
     * - HttpException if authentication fails
     * */
    protected authenticate = async (
        encodedAuthToken: string,
        authArgs?: BaseAuthParams
    ): Promise<User | HttpException> => {
        const { prisma } = this;

        if (!encodedAuthToken) {
            return new UnauthorizedException("Auth token is undefined");
        }

        const encodedUserId = this.getEncodedUserId(encodedAuthToken);
        const user = await prisma.user.findFirst({
            where: {
                id: encodedUserId,
            },
        });

        if (!user) {
            return new NotFoundException("user to corresponding id from auth-token not found");
        }

        const isAuthenticated = authArgs?.ignoreEmailConfirmation
            ? !!user
            : !!user && user.emailConfirmed;

        if (!isAuthenticated) {
            return new UnauthorizedException("Not authenticated");
        }

        return user;
    };
}
