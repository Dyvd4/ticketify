import { Config } from "@config";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import jwt from "jsonwebtoken";

const userRolesInclude = Prisma.validator<Prisma.UserInclude>()({
	role: true,
});
const userWithRoles = Prisma.validator<Prisma.UserArgs>()({
	include: userRolesInclude,
});

export type AuthState = {
	hasEmailConfirmation: boolean;
	isAuthenticated: boolean;
	currentUser: UserWithRoles | null;
};
export type UserWithRoles = Prisma.UserGetPayload<typeof userWithRoles>;

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

	public async getAuthState(encodedAuthToken: string): Promise<AuthState> {
		const { prisma } = this;

		const encodedUserId = this.getEncodedUserId(encodedAuthToken);
		const user = await prisma.user.findFirst({
			where: {
				id: encodedUserId,
			},
			include: userRolesInclude,
		});

		return {
			hasEmailConfirmation: !!user && user.emailConfirmed,
			isAuthenticated: !!user,
			currentUser: user,
		};
	}
}
