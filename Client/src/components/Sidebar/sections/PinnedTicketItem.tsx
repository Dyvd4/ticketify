import { Box, Tooltip, useToast } from "@chakra-ui/react";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { useMutation, useQueryClient } from "react-query";
import { removeEntity } from "src/api/entity";
import BaseSidebarListItem from "../SidebarListItem/BaseSidebarListItem";

type _PinnedTicketItemProps = {
    pinnedTicket: any;
};

export type PinnedTicketItemProps = PropsWithChildren<_PinnedTicketItemProps> &
    Omit<ComponentPropsWithRef<"a">, keyof _PinnedTicketItemProps>;

function PinnedTicketItem({ className, pinnedTicket, ...props }: PinnedTicketItemProps) {
    const queryClient = useQueryClient();
    const toast = useToast();

    const removeMutation = useMutation(
        () => {
            return removeEntity({
                route: "pinned-ticket",
                entityId: pinnedTicket.id,
            });
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["pinnedTickets"]);
                await queryClient.invalidateQueries(["ticketsToPin"]);
                toast({
                    status: "success",
                    title: `successfully unpinned ticket`,
                });
            },
        }
    );

    return (
        <Box
            className={`${className} flex items-center gap-2 
                        truncate whitespace-nowrap`}
        >
            <Tooltip placement="bottom" label="Remove" shouldWrapChildren>
                <FontAwesomeIcon
                    className="cursor-pointer"
                    onClick={() => removeMutation.mutate()}
                    icon={faThumbTack}
                />
            </Tooltip>
            <BaseSidebarListItem urlPath={`/Ticket/Details/${pinnedTicket.id}`} {...props}>
                {() => (
                    <>
                        #{pinnedTicket.id} {pinnedTicket.title}
                    </>
                )}
            </BaseSidebarListItem>
        </Box>
    );
}

export default PinnedTicketItem;
