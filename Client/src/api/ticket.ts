import { addEntity, updateEntity } from "./entity";

export const mutateTicket = async (ticket: any, variant: "add" | "edit") => {
    if (variant === "add") {
        const formData = new FormData();
        Object.keys(ticket || {}).forEach(key => {
            if (key !== "files") {
                formData.append(key, ticket[key])
            }
        });
        Array.from(ticket?.files || []).forEach(file => {
            formData.append("files", file as File);
        });
        return addEntity({
            route: "ticket",
            payload: formData,
            options: {
                headers: {
                    "content-type": "multipart/form-data"
                }
            }
        })
    }
    return updateEntity({
        route: "ticket",
        entityId: ticket.id,
        payload: ticket
    });
}