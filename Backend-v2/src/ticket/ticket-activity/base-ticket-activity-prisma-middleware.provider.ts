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

export abstract class BaseTicketActivityPrismaMiddlewareProvider {

	constructor(
		protected readonly prisma: PrismaService,
		protected readonly userService: UserService,
		protected readonly ticketActivityMailProvider: TicketActivityMailProvider
	) { }

	protected create(
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
}