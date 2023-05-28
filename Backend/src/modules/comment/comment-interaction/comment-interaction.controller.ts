import { User } from "@src/modules/global/auth/user.decorator";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CommentInteraction, User as TUser } from "@prisma/client";
import {
	CreateCommentInteractionDto,
	UpdateCommentInteractionDto,
} from "./comment-interaction.dtos";

@Controller("commentInteraction")
export class CommentInteractionController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	async findAll() {
		const { prisma } = this;

		const items = await prisma.commentInteraction.findMany();
		return { items };
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		const { prisma } = this;

		const commentInteraction = await prisma.commentInteraction.findFirst({
			where: {
				id,
			},
		});

		return commentInteraction;
	}

	@Post()
	async create(
		@User() requestUser: TUser,
		@Body() commentInteraction: CreateCommentInteractionDto
	) {
		const { prisma } = this;

		const existingInteraction = await prisma.commentInteraction.findUnique({
			where: {
				type_createdFromId_commentId: {
					createdFromId: requestUser.id,
					...commentInteraction,
				},
			},
		});

		await prisma.commentInteraction.deleteMany({
			where: {
				createdFromId: requestUser.id,
				commentId: commentInteraction.commentId,
			},
		});

		let newCommentInteraction: CommentInteraction | null = null;
		if (!existingInteraction) {
			newCommentInteraction = await prisma.commentInteraction.create({
				data: {
					createdFromId: requestUser.id,
					...commentInteraction,
				},
			});
		}

		return newCommentInteraction;
	}

	@Patch(":id")
	async update(@Param("id") id: string, @Body() commentInteraction: UpdateCommentInteractionDto) {
		const { prisma } = this;

		const updatedItem = await prisma.commentInteraction.update({
			where: {
				id,
			},
			data: commentInteraction,
		});

		return updatedItem;
	}

	@Delete(":id")
	async remove(@Param("id") id: string) {
		const { prisma } = this;

		const deletedItem = await prisma.commentInteraction.delete({
			where: {
				id,
			},
		});

		return deletedItem;
	}
}
