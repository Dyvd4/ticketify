import { User } from '@auth/auth.user.decorator';
import { PrismaService } from '@database/database.prisma.service';
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UnauthorizedException } from '@nestjs/common';
import { User as TUser } from "@prisma/client";
import { ValidationException } from '@src/global/global.validation.exception';
import FileEntityToClientDto from 'src/file/file.dtos';
import { CreateCommentDto, GetCommentsQueryDto, UpdateCommentDto } from './comment.dtos';
import { getInteractions, prismaIncludeParams, userHasInteracted } from './comment.service';

@Controller()
export class CommentController {

	constructor(
		private readonly prisma: PrismaService
	) { }

	@Get('comments')
	async getComments(
		@User() { id: UserId }: TUser,
		@Query() { orderBy }: GetCommentsQueryDto,
	) {
		const { prisma } = this;
		let comments = await prisma.comment.findMany({
			where: {
				parentId: null
			},
			include: prismaIncludeParams as any
		});

		(comments as any[]) = (comments as any[]).map(comment => {
			return {
				...comment,
				author: {
					...comment.author,
					avatar: comment.author.avatar?.file
						? FileEntityToClientDto(comment.author.avatar.file)
						: null
				},
				childs: comment.childs.map(child => {
					return {
						...child,
						author: {
							...child.author,
							avatar: child.author.avatar?.file
								? FileEntityToClientDto(child.author.avatar.file)
								: null
						},
						...getInteractions(child.interactions),
						liked: userHasInteracted(child.interactions, "like", UserId!),
						disliked: userHasInteracted(child.interactions, "dislike", UserId!),
						hearted: userHasInteracted(child.interactions, "heart", UserId!)
					}
				}),
				...getInteractions(comment.interactions),
				liked: userHasInteracted(comment.interactions, "like", UserId!),
				disliked: userHasInteracted(comment.interactions, "dislike", UserId!),
				hearted: userHasInteracted(comment.interactions, "heart", UserId!)
			}
		}).sort((a, b) => {
			if (orderBy === "newestFirst") {
				return new Date(b.createdAt).getUTCMilliseconds() - new Date(a.createdAt).getUTCMilliseconds();
			}
			if (orderBy === "mostLikes") {
				const aLikesLength = a.interactions.filter(interaction => interaction.type === "like").length;
				const bLikesLength = b.interactions.filter(interaction => interaction.type === "like").length;
				return bLikesLength - aLikesLength;
			}
			if (orderBy === "mostHearts") {
				const aHeartsLength = a.interactions.filter(interaction => interaction.type === "heart").length;
				const bHeartsLength = b.interactions.filter(interaction => interaction.type === "heart").length;
				return bHeartsLength - aHeartsLength;
			}
			return 0;
		})

		return comments;
	}

	@Get("comments/count/:ticketId")
	async getCommentsCountByTicketId(
		@Param("ticketId") ticketId: number
	) {

		const { prisma } = this;

		const count = await prisma.comment.count({
			where: {
				ticketId
			}
		});

		return count;
	}

	@Get("comments/count")
	async getCommentsCount() {
		const { prisma } = this;
		const count = await prisma.comment.count();
		return count;
	}

	@Get('comments/:ticketId')
	async getCommentsByTicketId(
		@User() { id: UserId }: TUser,
		@Query("orderBy") orderByParams: unknown,
		@Param("ticketId") ticketId: number
	) {
		const { prisma } = this;

		let comments = await prisma.comment.findMany({
			where: {
				parentId: null,
				ticketId
			},
			include: prismaIncludeParams as any
		});

		const orderBy: any = JSON.parse((orderByParams || "{}") as string);

		(comments as any[]) = (comments as any[]).map(comment => {
			return {
				...comment,
				author: {
					...comment.author,
					avatar: comment.author.avatar?.file
						? FileEntityToClientDto(comment.author.avatar.file)
						: null
				},
				childs: comment.childs.map(child => {
					return {
						...child,
						author: {
							...child.author,
							avatar: child.author.avatar?.file
								? FileEntityToClientDto(child.author.avatar.file)
								: null
						},
						...getInteractions(child.interactions),
						liked: userHasInteracted(child.interactions, "like", UserId!),
						disliked: userHasInteracted(child.interactions, "dislike", UserId!),
						hearted: userHasInteracted(child.interactions, "heart", UserId!)
					}
				}),
				...getInteractions(comment.interactions),
				liked: userHasInteracted(comment.interactions, "like", UserId!),
				disliked: userHasInteracted(comment.interactions, "dislike", UserId!),
				hearted: userHasInteracted(comment.interactions, "heart", UserId!)
			}
		}).sort((a, b) => {
			if (orderBy.property === "newestFirst") {
				return new Date(b.createdAt).getUTCMilliseconds() - new Date(a.createdAt).getUTCMilliseconds();
			}
			if (orderBy.property === "mostLikes") {
				const aLikesLength = a.interactions.filter(interaction => interaction.type === "like").length;
				const bLikesLength = b.interactions.filter(interaction => interaction.type === "like").length;
				return bLikesLength - aLikesLength;
			}
			if (orderBy.property === "mostHearts") {
				const aHeartsLength = a.interactions.filter(interaction => interaction.type === "heart").length;
				const bHeartsLength = b.interactions.filter(interaction => interaction.type === "heart").length;
				return bHeartsLength - aHeartsLength;
			}
			return 0;
		})

		return comments;
	}

	@Get('comment/:id')
	async findOne(@Param('id') id: string) {

		const { prisma } = this;

		const comment = await prisma.comment.findFirst({
			where: {
				id
			}
		});

		return comment;
	}

	@Post('comment')
	async create(
		@User() requestUser: TUser,
		@Body() createCommentDto: CreateCommentDto
	) {
		const { prisma } = this;

		createCommentDto.authorId = requestUser.id!;

		if (createCommentDto.parentId) {
			const parentComment = await prisma.comment.findFirst({
				where: {
					id: createCommentDto.parentId
				}
			});
			if (parentComment?.parentId) {
				return new ValidationException("Parent is not allowed to have a parent");
			}
		}

		const newComment = await prisma.comment.create({
			data: createCommentDto
		});

		return newComment;
	}

	@Patch('comment/:id')
	async update(
		@User() requestUser: TUser,
		@Param('id') id: string,
		@Body() updateCommentDto: UpdateCommentDto
	) {

		const { prisma } = this;

		const commentDb = await prisma.comment.findFirst({
			where: {
				id
			}
		});

		if (!commentDb) return new NotFoundException();

		if (commentDb.authorId !== requestUser.id) {
			return new UnauthorizedException({
				message: "Action is invalid because you are not the author of this comment"
			});
		}

		const updatedComment = await prisma.comment.update({
			where: {
				id
			},
			data: updateCommentDto
		});

		return updatedComment;
	}

	@Delete('comment/:id')
	async remove(
		@User() requestUser: TUser,
		@Param('id') id: string
	) {

		const { prisma } = this;

		const comment = await prisma.comment.findFirst({
			where: {
				id
			}
		});

		if (!comment) return new NotFoundException();

		if (comment.authorId !== requestUser.id) {
			return new UnauthorizedException({
				message: "Action is invalid because you are not the author of this comment"
			});
		}

		const deletedComment = await prisma.comment.delete({
			where: {
				id
			}
		});

		return deletedComment;
	}
}
