import { Alert, AlertIcon, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import TicketFormModal from "src/components/FormModals/Ticket";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import SectionBlock from "src/components/SectionBlock";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import { useInfiniteQuery } from "src/hooks/query";
import SetResponsibleUserButton from "./components/SetResponsibleUserButton";
import SetStatusButton from "./components/SetStatusButton";
import WatchTicketButton from "./components/WatchTicketButton";
import AttachmentsAddModal from "./modals/AttachmentsAddModal";
import AttachmentsEditModal from "./modals/AttachmentsEditModal";
import ConnectedTicketsAddModal from "./modals/ConnectedTicketsAddModal";
import ConnectedTicketsEditModal from "./modals/ConnectedTicketsEditModal";
import AttachmentsSection from "./sections/AttachmentsSection";
import CommentsSection from "./sections/CommentsSection";
import ConnectedTicketsSection from "./sections/ConnectedTicketsSection";
import HeadDataSection from "./sections/HeadDataSection";
import TicketActivitySection from "./sections/TicketActivitySection";

function TicketDetailsIndex() {

    useBreadcrumb([
        {
            name: "Home",
            href: "/"
        },
        {
            name: "Details",
            href: "#",
            isCurrentPage: true
        }
    ])

    // state
    // -----
    const { isOpen: ticketFormModalIsOpen, onOpen: onTicketFormModalOpen, onClose: onTicketFormModalClose } = useDisclosure();
    const { isOpen: attachmentsEditModalIsOpen, onOpen: onAttachmentsEditModalOpen, onClose: onAttachmentsEditModalClose } = useDisclosure();
    const { isOpen: attachmentsAddModalIsOpen, onOpen: onAttachmentsAddModalOpen, onClose: onAttachmentsAddModalClose } = useDisclosure();
    const { isOpen: connectedTicketsAddModalIsOpen, onOpen: onConnectedTicketsAddModalOpen, onClose: onConnectedTicketsAddModalClose } = useDisclosure();
    const { isOpen: connectedTicketsEditModalIsOpen, onOpen: onConnectedTicketsEditModalOpen, onClose: onConnectedTicketsEditModalClose } = useDisclosure();
    const [ticketFormModalVariant, setTicketFormModalVariant] = useState<"add" | "edit">("add");

    const { id } = useParams();

    // queries
    // -------
    const {
        isLoading: ticketLoading,
        isError: ticketError,
        data: ticket
    } = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

    const {
        isLoading: ticketAttachmentsLoading,
        isError: ticketAttachmentsError,
        data: ticketAttachments
    } = useQuery(["ticket/attachments", id], () => fetchEntity({ route: `ticket/attachments/${id}` }), {
        refetchOnWindowFocus: false
    });

    const activitiesQuery = useInfiniteQuery<any, any>(["ticketActivities", id], {
        route: "ticketActivities",
        queryParams: {
            ticketId: id
        }
    }, {
        refetchInterval: 60000
    });

    // event handler
    // -------------
    const handleOnTicketFormModalOpen = (variant) => {
        setTicketFormModalVariant(variant);
        onTicketFormModalOpen();
    }

    const isLoading = [ticketLoading, ticketAttachmentsLoading].some(loading => loading);
    if (isLoading) {
        return <LoadingRipple centered />
    }

    const isError = [ticketError, ticketAttachmentsError].some(error => error);
    if (isError) {
        return (
            <Alert className="rounded-md" status="error" variant="top-accent">
                <AlertIcon />
                <Text>
                    There was an error processing your request
                </Text>
            </Alert>
        )
    }

    const {
        files,
        images,
        attachments,
    } = ticketAttachments;

    const connectedToTickets = ticket.connectedToTickets.map(connectedToTicket => connectedToTicket.connectedToTicket);
    const connectedByTickets = ticket.connectedByTickets.map(connectedByTicket => connectedByTicket.connectedByTicket);

    return (
        <>
            {/* Head data section
                ================= */}
            <SectionBlock
                title="Head data"
                actions={[
                    <WatchTicketButton />,
                    <SetResponsibleUserButton />,
                    <SetStatusButton />
                ]}
                addButton={
                    <TooltipIconButton
                        variant="add"
                        tooltipProps={{
                            label: "add ticket"
                        }}
                        iconButtonProps={{
                            onClick: () => handleOnTicketFormModalOpen("add")
                        }}
                    />
                }
                editButton={
                    <TooltipIconButton
                        variant="edit"
                        tooltipProps={{
                            label: "edit ticket"
                        }}
                        iconButtonProps={{
                            onClick: () => handleOnTicketFormModalOpen("edit")
                        }}
                    />
                }>
                <HeadDataSection ticket={ticket} />
                {ticketFormModalVariant === "add" && <>
                    <TicketFormModal
                        isOpen={ticketFormModalIsOpen}
                        onClose={onTicketFormModalClose}
                        variant={ticketFormModalVariant}
                    />
                </>}
                {ticketFormModalVariant === "edit" && <>
                    <TicketFormModal
                        id={id}
                        isOpen={ticketFormModalIsOpen}
                        onClose={onTicketFormModalClose}
                        variant={ticketFormModalVariant}
                    />
                </>}
            </SectionBlock>
            {/* Attachments section
                =================== */}
            <SectionBlock
                className="mt-4"
                title="Attachments"
                addButton={
                    <TooltipIconButton
                        variant="add"
                        tooltipProps={{
                            label: "add attachment"
                        }}
                        iconButtonProps={{
                            onClick: onAttachmentsAddModalOpen
                        }}
                    />}
                editButton={
                    <TooltipIconButton
                        variant="edit"
                        tooltipProps={{
                            label: "edit attachments"
                        }}
                        iconButtonProps={{
                            disabled: attachments.length === 0,
                            onClick: onAttachmentsEditModalOpen
                        }}
                    />
                }>
                <AttachmentsSection
                    attachments={attachments}
                    images={images}
                    files={files}
                />
                <AttachmentsEditModal
                    isOpen={attachmentsEditModalIsOpen}
                    onClose={onAttachmentsEditModalClose}
                    attachments={attachments}
                />
                <AttachmentsAddModal
                    isOpen={attachmentsAddModalIsOpen}
                    onClose={onAttachmentsAddModalClose}
                />
            </SectionBlock>
            {/* Connected tickets section
                ========================= */}
            <SectionBlock
                title="Connected tickets"
                className="mt-4"
                addButton={
                    <TooltipIconButton
                        variant="add"
                        tooltipProps={{
                            label: "add connection"
                        }}
                        iconButtonProps={{
                            onClick: onConnectedTicketsAddModalOpen
                        }}
                    />
                }
                editButton={
                    <TooltipIconButton
                        variant="edit"
                        tooltipProps={{
                            label: "edit connections"
                        }}
                        iconButtonProps={{
                            disabled: connectedToTickets.concat(connectedByTickets).length === 0,
                            onClick: onConnectedTicketsEditModalOpen
                        }}
                    />
                }>
                <ConnectedTicketsSection
                    connectedByTickets={connectedByTickets}
                    connectedToTickets={connectedToTickets}
                />
                <ConnectedTicketsAddModal
                    connectedByTickets={connectedByTickets}
                    connectedToTickets={connectedToTickets}
                    isOpen={connectedTicketsAddModalIsOpen}
                    onClose={onConnectedTicketsAddModalClose}
                />
                <ConnectedTicketsEditModal
                    connectedByTickets={connectedByTickets}
                    connectedToTickets={connectedToTickets}
                    isOpen={connectedTicketsEditModalIsOpen}
                    onClose={onConnectedTicketsEditModalClose}
                />
            </SectionBlock>
            {/* Ticket activity section
                ======================= */}
            <TicketActivitySection activitiesQuery={activitiesQuery} />
            {/* Comments section
                ================ */}
            <CommentsSection ticket={ticket} />
        </>
    );
}

export default TicketDetailsIndex;