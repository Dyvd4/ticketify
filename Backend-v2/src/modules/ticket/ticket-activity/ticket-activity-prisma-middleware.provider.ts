import { Injectable } from "@nestjs/common";
import { PrismaService } from "@src/modules/global/database/prisma.service";
import { UserService } from "@src/modules/user/user.service";
import { BaseTicketActivityPrismaMiddlewareProvider } from "./base-ticket-activity-prisma-middleware.provider";
import { TicketActivityMailProvider } from "./ticket-activity-mail.provider";

@Injectable()
export class TicketActivityPrismaMiddleWareProvider extends BaseTicketActivityPrismaMiddlewareProvider {

	constructor(
		protected readonly prisma: PrismaService,
		protected readonly userService: UserService,
		protected readonly ticketActivityMailProvider: TicketActivityMailProvider
	) {
		super(prisma, userService, ticketActivityMailProvider)
	}

	createActivityIfDescriptionHasChanged = this.create("Ticket", ["update"], {
		onlyIf: async (event, args) => {

			const ticketId = args.where.id;
			const newDescription = args.data.description
			const ticket = (await this.prisma.ticket.findUnique({
				where: {
					id: ticketId
				}
			}))!

			const descriptionHasChanged = newDescription
				? ticket.description !== newDescription
				: false
			return [descriptionHasChanged, undefined];
		},
		descriptionEvaluator: async () => `Description changed`,
		ticketIdEvaluator: (event, args) => args.where.id
	});

	createActivityIfStatusHasChanged = this.create("Ticket", ["update"], {
		onlyIf: async (event, args) => {

			const ticketId = args.where.id;
			const newStatusId = args.data.statusId
			const oldTicket = (await this.prisma.ticket.findUnique({
				where: {
					id: ticketId
				},
				include: {
					responsibleUser: true,
					status: true
				}
			}))!

			const statusHasChanged = newStatusId
				? oldTicket.statusId !== newStatusId
				: false
			return [statusHasChanged, { oldTicket }];
		},
		descriptionEvaluator: async (event, args, ctx) => {

			const newStatusId = args.data.statusId;

			if (newStatusId) {
				const status = (await this.prisma.ticketStatus.findUnique({
					where: {
						id: newStatusId
					}
				}))!;

				return `Status changed from "${ctx.oldTicket.status!.name}" to "${status.name}"`
			}

			return null
		},
		ticketIdEvaluator: (event, args) => args.where.id
	});

	createActivityIfResponsibleUserHasChanged = this.create("Ticket", ["update"], {
		onlyIf: async (event, args) => {

			const ticketId = args.where.id;
			const newResponsibleUserId = args.data.responsibleUserId
			const oldTicket = (await this.prisma.ticket.findUnique({
				where: {
					id: ticketId
				},
				include: {
					responsibleUser: true,
					status: true
				}
			}))!

			const responsibleUserHasChanged = newResponsibleUserId
				? oldTicket.responsibleUserId !== newResponsibleUserId
				: false
			return [responsibleUserHasChanged, { oldTicket }]
		},
		descriptionEvaluator: async (event, args, ctx) => {

			const newResponsibleUserId = args.data.responsibleUserId

			if (newResponsibleUserId) {
				const responsibleUser = (await this.prisma.user.findUnique({
					where: {
						id: newResponsibleUserId
					}
				}))!;

				return `Responsible user changed from "${ctx.oldTicket.responsibleUser?.username || "none"}" to "${responsibleUser.username}"`
			}

			return null
		},
		ticketIdEvaluator: (event, args) => args.where.id
	});

	createActivityByComment = this.create("Comment", ["create", "update"], {
		onlyIf: async (event, args) => {
			if (event === "update") {

				const newCommentContent = args.data.content;

				const commentId = args.where.id;
				const oldComment = (await this.prisma.comment.findUnique({
					where: {
						id: commentId
					}
				}))!;

				const commentContentHasChanged = oldComment.content !== newCommentContent;
				return [commentContentHasChanged, { oldComment }];
			}
			return [true, undefined];
		},
		descriptionEvaluator: async (event, args, ctx) => {
			if (event === "update") {

				const newCommentContent = args.data.content;

				return `Comment content changed from "${ctx.oldComment.content}" to "${newCommentContent}"`;
			}
			return null;
		}
	});
}