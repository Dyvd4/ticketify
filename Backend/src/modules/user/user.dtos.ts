import { PickType } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserCreateDto implements Pick<User, "username" | "password" | "email"> {
	@IsString()
	@IsNotEmpty()
	username!: string;
	@IsString()
	@IsNotEmpty()
	password!: string;
	@IsEmail()
	email!: string;
}

export class UpdateUsernameDto extends PickType(UserCreateDto, ["username"]) {}
export class UpdateEmailDto extends PickType(UserCreateDto, ["email"]) {}
export class UpdateUserRoleDto implements Pick<User, "roleId"> {
	@IsString()
	@IsOptional()
	roleId!: string | null;
}
export class NewPasswordDto {
	@IsString()
	@IsNotEmpty()
	currentPassword!: string;
	@IsString()
	@IsNotEmpty()
	newPassword!: string;
	@IsString()
	@IsNotEmpty()
	repeatedNewPassword!: string;
}
