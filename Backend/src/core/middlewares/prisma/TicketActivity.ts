import { sendTicketActivityEmailToWatchingUsers } from "@core/mail-delivery/TicketActivityMailDelivery";
import { getCurrentUser } from "@core/services/CurrentUserService";
import prisma from "@prisma";
import { Prisma } from "@prisma/client";

export type Event = "create" | "update";
type ActivityEventMap = Record<Event, string>

export const TicketActivityEvents: Event[] = ["create", "update"];
export const TicketActivityEventColorMap: ActivityEventMap = {
    "update": "yellow-500",
    "create": "green-500",
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

// TODO: add generic to get better type inference
interface TicketActivityOptions {
    disableMailDelivery?: boolean,
    /** 
     * return false if a ticket activity should not be created 
     * @param args
     * Arguments that were passed into the query - for example, where, data, or orderBy
     */
    onlyIf?: (event: Event, args: any) => Promise<boolean>
    /**
     * evaluator to get the ticketId for ticket activity via the args
     * @param args
     * Arguments that were passed into the query - for example, where, data, or orderBy
     */
    ticketIdEvaluator?: (event: Event, args: any) => Promise<string>
    /**
     * evaluator to create a custom title for ticket activity via the args
     * @param args
     * Arguments that were passed into the query - for example, where, data, or orderBy
     */
    titleEvaluator?: (event: Event, args: any) => Promise<string>
    /** 
     * evaluator to create a custom description for ticket activity via the args
     * @param args
     * Arguments that were passed into the query - for example, where, data, or orderBy
     */
    descriptionEvaluator?: (event: Event, args: any) => Promise<string | null>
}
/** creates a ticket activity based on changed entities related to ticket
 * @param ticketIdEvaluator if the tickedId of the entity is not named in the proper naming convention,
 * this callback can be used to return the ticketId of the entity
 */
const CreateTicketActivityBasedOn = (
    entityName: ActivityModels,
    events: Event[],
    options?: TicketActivityOptions) => {
    return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
        if (params.model === entityName &&
            (events as string[]).includes(params.action) &&
            (!options?.onlyIf || (await options.onlyIf(params.action as Event, params.args)))) {

            const event = params.action as Event;
            const entity = params.args.data;

            const title = options?.titleEvaluator && (await options.titleEvaluator(event, params.args)) ||
                `${entityName} ${TicketActivityEventLabelMap[event]}`

            const description = options?.descriptionEvaluator &&
                (await options.descriptionEvaluator(event, params.args))

            const createdTicketActivity = await prisma.ticketActivity.create({
                data: {
                    ticketId: entity.ticketId || options?.ticketIdEvaluator && (await options.ticketIdEvaluator(event, params.args)),
                    title,
                    createdFromId: getCurrentUser().id,
                    icon: TicketActivityModelIconMap[entityName],
                    color: TicketActivityEventColorMap[event],
                    description
                }
            });

            if (!options?.disableMailDelivery) {
                await sendTicketActivityEmailToWatchingUsers(createdTicketActivity.id);
            }

        }
        return (await next(params));
    }
}

export default CreateTicketActivityBasedOn;