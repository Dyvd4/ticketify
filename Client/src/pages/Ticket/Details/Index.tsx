import { Alert, AlertIcon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Text, useDisclosure } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import TooltipIconButton from "src/components/Buttons/TooltipIconButton";
import TicketFormModal from "src/components/FormModals/Ticket";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import SectionBlock from "src/components/SectionBlock";
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

function TicketDetailsIndex() {
    // state
    // -----
    const { isOpen: ticketFormModalIsOpen, onOpen: onTicketFormModalOpen, onClose: onTicketFormModalClose } = useDisclosure();
    const { isOpen: attachmentsEditModalIsOpen, onOpen: onAttachmentsEditModalOpen, onClose: onAttachmentsEditModalClose } = useDisclosure();
    const { isOpen: attachmentsAddModalIsOpen, onOpen: onAttachmentsAddModalOpen, onClose: onAttachmentsAddModalClose } = useDisclosure();
    const { isOpen: connectedTicketsAddModalIsOpen, onOpen: onConnectedTicketsAddModalOpen, onClose: onConnectedTicketsAddModalClose } = useDisclosure();
    const { isOpen: connectedTicketsEditModalIsOpen, onOpen: onConnectedTicketsEditModalOpen, onClose: onConnectedTicketsEditModalClose } = useDisclosure();

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
        <Container maxW="container.lg">
            <Breadcrumb
                className="font-bold my-4"
                separator={<FontAwesomeIcon icon={faChevronRight} size="xs" />}>
                <BreadcrumbItem className="text-secondary-hover">
                    <BreadcrumbLink href="/">
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem className="text-secondary-hover">
                    <BreadcrumbLink href="#" isCurrentPage>
                        Details
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            {/* Head data section
                ----------------- */}
            <SectionBlock
                title="Head data"
                actions={[
                    <WatchTicketButton />,
                    <SetResponsibleUserButton />,
                    <SetStatusButton />
                ]}
                editButton={
                    <TooltipIconButton
                        iconVariant="edit"
                        onClick={onTicketFormModalOpen}
                    />
                }>
                <HeadDataSection ticket={ticket} />
                <TicketFormModal
                    id={id}
                    isOpen={ticketFormModalIsOpen}
                    onClose={onTicketFormModalClose}
                    variant="edit"
                />
            </SectionBlock>
            {/* Attachments section
                ------------------- */}
            <SectionBlock
                className="mt-4"
                title="Attachments"
                addButton={
                    <TooltipIconButton
                        iconVariant="add"
                        onClick={onAttachmentsAddModalOpen}
                    />}
                editButton={
                    <TooltipIconButton
                        iconVariant="edit"
                        disabled={attachments.length === 0}
                        onClick={onAttachmentsEditModalOpen}
                    />
                }>
                <AttachmentsSection
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
                ------------------------- */}
            <SectionBlock
                title="Connected tickets"
                className="mt-4"
                editButton={
                    <TooltipIconButton
                        iconVariant="edit"
                        disabled={connectedToTickets.concat(connectedByTickets).length === 0}
                        onClick={onConnectedTicketsEditModalOpen}
                    />
                }
                addButton={
                    <TooltipIconButton
                        iconVariant="add"
                        onClick={onConnectedTicketsAddModalOpen}
                    />}>
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
            {/*Comments section
                --------------- */}
            <CommentsSection ticket={ticket} />
        </Container>
    );
}

export default TicketDetailsIndex;