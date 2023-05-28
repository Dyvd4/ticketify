import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UserService } from "./user.service";

@Injectable()
export class UserPrismaMiddleWareProvider {
	constructor(private readonly userService: UserService) {}

	userSignature = async (
		params: Prisma.MiddlewareParams,
		next: (params: Prisma.MiddlewareParams) => Promise<any>
	) => {
		const currentUser = this.userService.getCurrentUser();

		if (params.action === "create") {
			params.args.data.createUser = currentUser?.username || "NotSignedIn";
			params.args.data.updateUser = currentUser?.username || "NotSignedIn";
		}

		if (params.action === "update") {
			params.args.data.updateUser = currentUser?.username || "NotSignedIn";
		}

		return await next(params);
	};
}
