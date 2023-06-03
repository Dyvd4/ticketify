import { Injectable } from "@nestjs/common";
import { BaseAuthService, UserWithRoles } from "./base-auth.service";
import { RoleName } from "./auth.decorator";

@Injectable()
export class AuthService extends BaseAuthService {
	public isAuthorizedForRole(user: UserWithRoles, roleName: RoleName): boolean {
		const userRoleName = user.role?.name as RoleName;
		if (userRoleName === "super-admin") {
			return true;
		}
		if (userRoleName === "admin" && roleName !== "super-admin") {
			return true;
		}
		return userRoleName === roleName;
	}
}
