import { OmitType } from "@nestjs/swagger";
import { CommentInteraction } from "@prisma/client";
import { IsString } from "class-validator";

type CreateCommentInteraction = Omit<CommentInteraction, "createdAt" | "updatedAt" | "createUser" | "updateUser" | "id" | "createdFromId">

export class CreateCommentInteractionDto implements CreateCommentInteraction {
	@IsString()
	type!: string;
	@IsString()
	commentId!: string
}

export class UpdateCommentInteractionDto extends OmitType(CreateCommentInteractionDto, []) { }