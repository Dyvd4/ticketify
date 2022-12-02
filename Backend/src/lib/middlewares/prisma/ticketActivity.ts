import { Prisma } from "@prisma/client";
import prisma from "@prisma";
import { getCurrentUser } from "@services/currentUser";

type Action = "create" | "update";
type ActivityActionMap = {
    [key in Action]: string
}
type ActivityModelMap = {
    [key in Prisma.ModelName]?: string
}

const TicketActivityIconMap: ActivityModelMap = {
    "Comment": "comment"
}
const TicketActivityColorMap: ActivityActionMap = {
    "update": "yellow-500",
    "create": "green-500",
}
const TicketActivityActionMap: ActivityActionMap = {
    "update": "updated",
    "create": "created"
}
const TicketActivityActions: Action[] = ["create", "update"];

/** creates an action related to ticket
 * @param ticketIdEvaluator if the tickedId of the entity is not named in the proper naming convention,
 * this callback can be used to return the ticketId of the entity
 */
const ticketActivity = (entityName: Prisma.ModelName, entityNameAlias?: string, ticketIdEvaluator?: (entity: any) => string) => {
    return async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
        if (params.model === entityName && (TicketActivityActions as string[]).includes(params.action)) {
            await prisma.ticketActivity.create({
                data: {
                    ticketId: params.args.data.ticketId || ticketIdEvaluator && ticketIdEvaluator(params.args.data),
                    entityName: entityNameAlias || entityName,
                    createdFromId: getCurrentUser().id,
                    action: TicketActivityActionMap[params.action],
                    icon: TicketActivityIconMap[entityName],
                    color: TicketActivityColorMap[params.action]
                }
            });
        }
        return (await next(params));
    }
}

export default ticketActivity;