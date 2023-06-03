import { SetMetadata } from "@nestjs/common";
import { UserWithRoles } from "./base-auth.service";

export type RoleName = "super-admin" | "admin" | "customer";
export const ROLE_NAME: Record<RoleName, RoleName> = {
	"super-admin": "super-admin",
	admin: "admin",
	customer: "customer",
};

export interface AuthDecoratorParams {
	disable?: boolean;
	strategy?(user: UserWithRoles): boolean;
	roleName?: RoleName;
	ignoreEmailConfirmation?: boolean;
}

export const Auth = (args?: AuthDecoratorParams) => SetMetadata("authOptions", args);
