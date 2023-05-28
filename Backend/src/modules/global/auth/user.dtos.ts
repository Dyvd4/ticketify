import { User } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserSignInDto implements Pick<User, "username" | "password"> {
	@IsString()
	@IsNotEmpty()
	username!: string;
	@IsString()
	@IsNotEmpty()
	password!: string;
}

export class UserSignUpDto extends UserSignInDto {
	@IsEmail()
	email!: string;
}
