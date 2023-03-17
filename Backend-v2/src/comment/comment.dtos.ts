import { PickType } from "@nestjs/swagger"
import { Comment } from "@prisma/client"
import { IsNumber, IsOptional, IsString, Length } from "class-validator"

type CreateComment = Omit<Comment, "createdAt" | "updatedAt" | "createUser" | "updateUser" | "id">

export class CreateCommentDto implements CreateComment {
	@IsNumber()
	ticketId!: number
	@Length(1, 1000)
	@IsString()
	content!: string
	@IsString()
	authorId!: string
	@IsString()
	@IsOptional()
	parentId!: string | null
}

export class UpdateCommentDto extends PickType(CreateCommentDto, ["content"]) { }

export class GetCommentsQueryDto {
	@IsString()
	orderBy!: string
}
