import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@src/global/database/database.prisma.service";
import { UserService } from "@src/user/user.service";
import { TicketActivityMailProvider } from "./ticket-activity-mail.provider";

export type Event = "create" | "update";
type ActivityEventMap = Record<Event, string>

export const TicketActivityEvents: Event[] = ["create", "update"];
export const TicketActivityEventColorMap: ActivityEventMap = {
	"update": "yellow.500",
	"create": "green.500",
}
export const TicketActivityEventLabelMap: ActivityEventMap = {
	"update": "updated",
	"create": "created"
}

export type ActivityModels = Extract<Prisma.ModelName, "Comment" | "Ticket">
type ActivityModelIconMap = Partial<Record<ActivityModels, string>>

export const TicketActivityModelIconMap: ActivityModelIconMap = {
	"Comment": "comment",
	"Ticket": "ticket"
}

interface TicketActivityOptions {
	disableMailDelivery?: boolean,
	/** 
	 * return false if a ticket activity should not be created 
	 * @param args
	 * Arguments that were passed into the query - for example: where, data, or orderBy
	 */
	onlyIf?: (event: Event, args: any) => Promise<[onlyIf: boolean, context: any]>
	/**
	 * evaluator to get the ticketId for ticket activity via the args
	 * @param args
	 * Arguments that were passed into the query - for example: where, data, or orderBy
	 */
	ticketIdEvaluator?: (event: Event, args: any, context?: any) => Promise<string>
	/**
	 * evaluator to create a custom title for ticket activity via the args
	 * @param args
	 * Arguments that were passed into the query - for example: where, data, or orderBy
	 */
	titleEvaluator?: (event: Event, args: any, context?: any) => Promise<string>
	/** 
	 * evaluator to create a custom description for ticket activity via the args
	 * @param args
	 * Arguments that were passed into the query - for example: where, data, or orderBy
	 */
	descriptionEvaluator?: (event: Event, args: any, context?: any) => Promise<string | null>
}
/** creates a ticket activity based on changed entities related to ticket
 * @param ticketIdEvaluator if the tickedId of the entity is not named in the proper naming convention,
 * this callback can be used to return the ticketId of the entity
 */

@Injectable()
export class TicketActivityMiddleWareProvider {

	constructor(
		private readonly prisma: PrismaService,
		private readonly userService: UserService,
		private readonly ticketActivityMailProvider: TicketActivityMailProvider
	) { }

	private create(
		entityName: ActivityModels,
		events: Event[],
		options?: TicketActivityOptions) {
		return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {

			if (params.model === entityName && (events as string[]).includes(params.action)) {

				let context;

				if (options?.onlyIf) {
					const [shouldPass, ctx] = await options.onlyIf(params.action as Event, params.args)
					if (!shouldPass) return (await next(params));
					context = ctx;
				}

				const event = params.action as Event;
				const entity = params.args.data;

				const title = options?.titleEvaluator && (await options.titleEvaluator(event, params.args, context)) ||
					`${entityName} ${TicketActivityEventLabelMap[event]}`

				const description = options?.descriptionEvaluator &&
					(await options.descriptionEvaluator(event, params.args, context))

				const createdTicketActivity = await this.prisma.ticketActivity.create({
					data: {
						ticketId: entity.ticketId || options?.ticketIdEvaluator && (await options.ticketIdEvaluator(event, params.args, context)),
						title,
						createdFromId: this.userService.getCurrentUser()!.id,
						icon: TicketActivityModelIconMap[entityName],
						color: TicketActivityEventColorMap[event],
						description
					}
				});

				if (!options?.disableMailDelivery) {
					this.ticketActivityMailProvider.sendEmailToWatchingUsers(createdTicketActivity.id);
				}
			}

			return (await next(params));
		}
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