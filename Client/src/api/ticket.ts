import { addEntity, updateEntity } from "./entity";

const payload = {
    title: null,
    responsibleUserId: null,
    dueDate: null,
    priorityId: null,
    files: null,
    description: null,
};

type PayloadKeys = keyof typeof payload;

export const mutateTicket = async (ticket: any, variant: "add" | "edit") => {
    if (variant === "add") {
        const formData = new FormData();
        Object.keys(ticket || {}).forEach((key) => {
            if (key !== "files" && Object.keys(payload).includes(key)) {
                formData.append(key, ticket[key]);
            }
        });
        Array.from(ticket?.files || []).forEach((file) => {
            formData.append("files", file as File);
        });
        return addEntity({
            route: "ticket",
            payload: formData,
            options: {
                headers: {
                    "content-type": "multipart/form-data",
                },
            },
        });
    }
    return updateEntity({
        route: "ticket",
        entityId: ticket.id,
        payload: {
            title: ticket.title,
            responsibleUserId: ticket.responsibleUserId,
            dueDate: ticket.dueDate,
            priorityId: ticket.priorityId,
            files: ticket.files,
            description: ticket.description,
        } satisfies Record<PayloadKeys, any>,
    });
};
