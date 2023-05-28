import { HttpException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { BaseAuthParams, BaseAuthService } from "./base-auth.service";

export interface AuthParams extends BaseAuthParams {
	/**
	 * @returns
	 * - true as first tuple item if user should pass the authorization
	 * - exception as second tuple item. Get's thrown if authorization fails
	 * */
	strategy?: (user: User) => User | HttpException;
}

@Injectable()
export class AuthService extends BaseAuthService {
	/**
	 * @returns
	 * - User if authorization passes
	 * - HttpException if authentication fails
	 * */
	public authorize = async (
		encodedAuthToken: string,
		authArgs?: AuthParams
	): Promise<User | HttpException> => {
		let userOrException = await this.authenticate(encodedAuthToken, authArgs);

		if (userOrException instanceof HttpException) {
			return userOrException;
		}

		if (!!authArgs?.strategy) {
			userOrException = authArgs.strategy(userOrException);
		}

		return userOrException;
	};
}
