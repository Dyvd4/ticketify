import { HttpException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthenticationParams, AuthenticationService } from "./auth.authentication.service";

export interface AuthParams extends AuthenticationParams {
	/**
	 * @returns 
	 * - true as first tuple item if user should pass the authorization
	 * - exception as second tuple item. Get's thrown if authorization fails
	 * */
	strategy?: (user: User) => User | HttpException
}

@Injectable()
export class AuthService extends AuthenticationService {

	/**
	* @returns 
	* - User is authorization passes
	* - HttpException if authentication fails
	* */
	public authorize = async (encodedAuthToken: string, authArgs?: AuthParams): Promise<User | HttpException> => {

		let userOrException = await this.authenticate(encodedAuthToken, authArgs);

		if (userOrException instanceof HttpException) {
			return userOrException;
		}
		if (!!authArgs?.strategy) {
			userOrException = authArgs.strategy(userOrException);
		}

		return userOrException;
	}
}