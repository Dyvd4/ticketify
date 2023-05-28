import { CanActivate, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";

const dummyUser: User = {
	id: "12345",
	username: "johndoe",
	password: "secretpassword",
	email: "johndoe@example.com",
	emailConfirmed: true,
	createdAt: new Date("2022-01-01T00:00:00.000Z"),
	updatedAt: new Date("2022-01-01T01:00:00.000Z"),
	createUser: null,
	updateUser: "admin",
};

export class AuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest<Request>();

		request.User = dummyUser;
		return true;
	}
}
