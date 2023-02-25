import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

export class UserSignInDto implements Pick<User, "username" | "password">{
	@ApiProperty()
	@IsString()
	username!: string;
	@ApiProperty()
	@IsString()
	password!: string
}

export class UserSignUpDto extends UserSignInDto {
	@ApiProperty()
	@IsEmail()
	email!: string
}