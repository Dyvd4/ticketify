import { useQuery } from "react-query";
import { addEntity, fetchEntity, removeEntity } from "./entity";
export const addPinnedTicket = (ticketId: number) => {
    return addEntity({
        route: "pinned-ticket",
        payload: {
            ticketId
        }
    });
}

export const removePinnedTicket = (ticketId: number) => {
    return removeEntity({
        route: "pinned-ticket",
        entityId: ticketId.toString()
    });
}

export const useTicketIsPinned = (ticketId: number): [ticketIsPinned: boolean, isLoading: boolean] => {
    const [pinnedTickets, isLoading] = usePinnedTickets();
    const ticketIsPinned = pinnedTickets && pinnedTickets.find(pinnedTicket => pinnedTicket.id === +ticketId!);
    return [ticketIsPinned, isLoading];
}

export const usePinnedTickets = (): [pinnedTickets: any, isLoading: boolean] => {
    const { isLoading, ...query } = useQuery(["pinnedTickets"], () => fetchEntity({
        route: "pinned-tickets"
    }));
    const pinnedTickets = !isLoading && query.data.items;
    return [pinnedTickets, isLoading];
}

export const mutatePinnedTicket = (ticketId: string, ticketIsPinned: boolean) => {
    return ticketIsPinned
        ? removePinnedTicket(+ticketId!)
        : addPinnedTicket(+ticketId!);
}