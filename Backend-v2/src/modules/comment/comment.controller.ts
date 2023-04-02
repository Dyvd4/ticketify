import { User } from '@src/modules/global/auth/user.decorator';
import { PrismaService } from '@src/modules/global/database/prisma.service';
import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UnauthorizedException } from '@nestjs/common';
import { User as TUser } from "@prisma/client";
import { FileService } from '@src/modules/file/file.service';
import { ValidationException } from '@src/modules/global/validation.exception';
import { CreateCommentDto, GetCommentsQueryDto, UpdateCommentDto } from './comment.dtos';
import { getInteractions, prismaIncludeParams, userHasInteracted } from './comment.service';

@Controller()
export class CommentController {

	constructor(
		private readonly prisma: PrismaService,
		private readonly fileService: FileService
	) { }

	@Get('comments')
	async getComments(
		@User() { id: UserId }: TUser,
		@Query() { orderBy }: GetCommentsQueryDto,
	) {
		const { prisma } = this;
		const comments = await prisma.comment.findMany({
			where: {
				parentId: null
			},
			include: prismaIncludeParams as any
		});

		const mappedComments = (await Promise.all((comments as any[]).map(comment => {
			return (async () => {
				const childComments = await Promise.all(comment.childs.map(child => {
					return (async () => {
						return {
							...child,
							author: {
								...child.author,
								avatar: child.author.avatar?.file
									? await this.fileService.getFileWithSignedUrl(child.author.avatar.file)
									: null
							},
							...getInteractions(child.interactions),
							liked: userHasInteracted(child.interactions, "like", UserId!),
							disliked: userHasInteracted(child.interactions, "dislike", UserId!),
							hearted: userHasInteracted(child.interactions, "heart", UserId!)
						}
					})()
				}))
				return {
					...comment,
					author: {
						...comment.author,
						avatar: comment.author.avatar?.file
							? await this.fileService.getFileWithSignedUrl(comment.author.avatar.file)
							: null
					},
					childs: childComments,
					...getInteractions(comment.interactions),
					liked: userHasInteracted(comment.interactions, "like", UserId!),
					disliked: userHasInteracted(comment.interactions, "dislike", UserId!),
					hearted: userHasInteracted(comment.interactions, "heart", UserId!)
				}
			})()
		}))).sort((a, b) => {
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

		return mappedComments;
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
		@Query() { orderBy }: GetCommentsQueryDto,
		@Param("ticketId") ticketId: number
	) {
		const { prisma } = this;

		const comments = await prisma.comment.findMany({
			where: {
				parentId: null,
				ticketId
			},
			include: prismaIncludeParams as any
		});

		const mappedComments = (await Promise.all((comments as any[]).map(comment => {
			return (async () => {
				const childComments = await Promise.all(comment.childs.map(child => {
					return (async () => {
						return {
							...child,
							author: {
								...child.author,
								avatar: child.author.avatar?.file
									? await this.fileService.getFileWithSignedUrl(child.author.avatar.file)
									: null
							},
							...getInteractions(child.interactions),
							liked: userHasInteracted(child.interactions, "like", UserId!),
							disliked: userHasInteracted(child.interactions, "dislike", UserId!),
							hearted: userHasInteracted(child.interactions, "heart", UserId!)
						}
					})()
				}))
				return {
					...comment,
					author: {
						...comment.author,
						avatar: comment.author.avatar?.file
							? await this.fileService.getFileWithSignedUrl(comment.author.avatar.file)
							: null
					},
					childs: childComments,
					...getInteractions(comment.interactions),
					liked: userHasInteracted(comment.interactions, "like", UserId!),
					disliked: userHasInteracted(comment.interactions, "dislike", UserId!),
					hearted: userHasInteracted(comment.interactions, "heart", UserId!)
				}
			})()
		}))).sort((a, b) => {
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

		return mappedComments;
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
				throw new ValidationException("Parent is not allowed to have a parent");
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
