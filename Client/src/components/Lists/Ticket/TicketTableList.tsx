import { Link, Tag, Td, useDisclosure } from "@chakra-ui/react";
import { format } from "date-fns";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import TicketFormModal from "src/components/FormModals/Ticket";
import { TableList } from "src/components/List";

type _TicketTableListProps = {};

export type TicketTableListProps = _TicketTableListProps &
    Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _TicketTableListProps>;

function TicketTableList({ className, ...props }: TicketTableListProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <TableList
                id="35c7d181-8dcf-4772-a188-37d099224424"
                fetch={{
                    route: "tickets/pager",
                    queryKey: "ticket",
                }}
                header={{
                    showCount: true,
                }}
                columns={[
                    {
                        property: "title",
                        label: "title",
                        disabled: true,
                    },
                    {
                        property: "responsibleUser.username",
                        label: "responsible user",
                        disabled: true,
                    },
                    {
                        property: "status.name",
                        label: "status",
                        disabled: true,
                    },
                    {
                        property: "priority.name",
                        label: "priority",
                        disabled: true,
                    },
                    {
                        property: "dueDate",
                        label: "due date",
                        disabled: true,
                    },
                ]}
                filter={[
                    {
                        property: "priority.name",
                        label: "priority",
                        type: "string",
                    },
                ]}
                search={{
                    property: "title",
                    label: "search by title...",
                    type: "string",
                    operation: {
                        value: "contains",
                    },
                }}
                onAdd={onOpen}
                listItemRender={(ticket) => (
                    <>
                        <Td maxWidth={"200px"} className="truncate">
                            <Link href={`/Ticket/Details/${ticket.id}`}>
                                #{ticket.id} {ticket.title}
                            </Link>
                        </Td>
                        <Td>{ticket.responsibleUser?.username || "-"}</Td>
                        <Td>
                            <Tag colorScheme={ticket.status.color} key={1}>
                                {ticket.status.name}
                            </Tag>
                        </Td>
                        <Td>
                            <Tag colorScheme={ticket.priority.color} key={2}>
                                {ticket.priority.name}
                            </Tag>
                        </Td>
                        <Td>
                            {ticket.dueDate && (
                                <>{format(new Date(ticket.dueDate), "dd.MM.yy, HH:mm")}</>
                            )}
                            {!ticket.dueDate && "-"}
                        </Td>
                    </>
                )}
            />
            <TicketFormModal isOpen={isOpen} onClose={onClose} />
        </>
    );
}

export default TicketTableList;
