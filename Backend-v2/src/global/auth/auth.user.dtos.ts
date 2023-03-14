import { User } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class UserSignInDto implements Pick<User, "username" | "password">{
	@IsString()
	username!: string;
	@IsString()
	password!: string
}

export class UserSignUpDto extends UserSignInDto {
	@IsEmail()
	email!: string
}