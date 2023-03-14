import { PickType } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class UserCreateDto implements Pick<User, "username" | "password" | "email"> {
	@IsString()
	username!: string
	@IsString()
	password!: string
	@IsEmail()
	email!: string
}

export class UpdateUsernameDto extends PickType(UserCreateDto, ["username"]) { }
export class UpdateEmailDto extends PickType(UserCreateDto, ["email"]) { }

export class NewPasswordDto {
	@IsString()
	currentPassword!: string
	@IsString()
	newPassword!: string
	@IsString()
	repeatedNewPassword!: string
}