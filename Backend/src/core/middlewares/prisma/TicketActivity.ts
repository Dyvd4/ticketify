import { sendTicketActivityEmailToWatchingUsers } from "@core/mail-delivery/TicketActivityMailDelivery";
import { getCurrentUser } from "@core/services/CurrentUserService";
import prisma from "@prisma";
import { Prisma } from "@prisma/client";

export type Action = "create" | "update";
type ActivityActionMap = Record<Action, string>

export const TicketActivityActions: Action[] = ["create", "update"];
export const TicketActivityActionColorMap: ActivityActionMap = {
    "update": "yellow-500",
    "create": "green-500",
}
export const TicketActivityActionLabelMap: ActivityActionMap = {
    "update": "updated",
    "create": "created"
}

export type ActivityModels = Extract<Prisma.ModelName, "Comment">
type ActivityModelIconMap = Partial<Record<ActivityModels, string>>

export const TicketActivityModelIconMap: ActivityModelIconMap = {
    "Comment": "comment"
}

interface TicketActivityOptions {
    entityNameAlias?: string,
    ticketIdEvaluator?: (entity: any) => string,
    disableMailDelivery?: boolean,
    /** defines explicitly actions that should be used */
    actions?: Action[]
    /** evaluator for description per action */
    // TODO: make it so that the compiler infers the selected actions
    // and create an evaluator only for the selected ones
    descriptionEvaluator?: Partial<Record<Action, (entity: any) => string>>
}

/** creates an action related to ticket
 * @param ticketIdEvaluator if the tickedId of the entity is not named in the proper naming convention,
 * this callback can be used to return the ticketId of the entity
 */
const TicketModelActivity = (
    entityName: ActivityModels,
    options?: TicketActivityOptions) => {
    return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
        if (params.model === entityName && (options?.actions || TicketActivityActions as string[]).includes(params.action)) {

            const title = `${options?.entityNameAlias || entityName} ${TicketActivityActionLabelMap[params.action as Action]}`
            const description = options?.descriptionEvaluator &&
                options.descriptionEvaluator[params.action as Action]?.(params.args.data)

            const createdTicketActivity = await prisma.ticketActivity.create({
                data: {
                    ticketId: params.args.data.ticketId || options?.ticketIdEvaluator && options.ticketIdEvaluator(params.args.data),
                    title,
                    createdFromId: getCurrentUser().id,
                    icon: TicketActivityModelIconMap[entityName],
                    color: TicketActivityActionColorMap[params.action],
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

export default TicketModelActivity;