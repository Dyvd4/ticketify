import { Alert, AlertIcon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { faAdd, faChevronRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import TicketFormModal from "src/components/FormModals/Ticket";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import SectionBlock from "src/components/SectionBlock";
import IconButton from "src/components/Wrapper/IconButton";
import SetResponsibleUserButton from "./components/SetResponsibleUserButton";
import SetStatusButton from "./components/SetStatusButton";
import AttachmentsAddModal from "./modals/AttachmentsAddModal";
import AttachmentsEditModal from "./modals/AttachmentsEditModal";
import AttachmentsSection from "./sections/AttachmentsSection";
import CommentsSection from "./sections/CommentsSection";
import HeadDataSection from "./sections/HeadDataSection";

function TicketDetailsIndex() {
    // state
    // -----
    const { isOpen: ticketFormModalIsOpen, onOpen: onTicketFormModalOpen, onClose: onTicketFormModalClose } = useDisclosure();
    const { isOpen: attachmentsEditModalIsOpen, onOpen: onAttachmentsEditModalOpen, onClose: onAttachmentsEditModalClose } = useDisclosure();
    const { isOpen: attachmentsAddModalIsOpen, onOpen: onAttachmentsAddModalOpen, onClose: onAttachmentsAddModalClose } = useDisclosure();

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
            <SectionBlock
                title="Head data"
                actions={[
                    <SetResponsibleUserButton />,
                    <SetStatusButton />
                ]}
                editButton={
                    <Tooltip
                        label={"edit"}
                        placement="top">
                        <IconButton
                            onClick={onTicketFormModalOpen}
                            size={"sm"}
                            aria-label={"edit"}
                            icon={<FontAwesomeIcon icon={faEdit} />}
                        />
                    </Tooltip>
                }>
                <HeadDataSection ticket={ticket} />
                <TicketFormModal
                    id={id}
                    isOpen={ticketFormModalIsOpen}
                    onClose={onTicketFormModalClose}
                    variant="edit"
                />
            </SectionBlock>
            <SectionBlock
                className="mt-4"
                title="Attachments"
                addButton={
                    <Tooltip
                        label={"add"}
                        placement="top">
                        <IconButton
                            colorScheme={"cyan"}
                            onClick={onAttachmentsAddModalOpen}
                            size={"sm"}
                            aria-label={"add"}
                            icon={<FontAwesomeIcon icon={faAdd} />}
                        />
                    </Tooltip>
                }
                editButton={
                    <Tooltip
                        label={"edit"}
                        placement="top">
                        <IconButton
                            onClick={onAttachmentsEditModalOpen}
                            disabled={attachments.length === 0}
                            size={"sm"}
                            aria-label={"edit"}
                            icon={<FontAwesomeIcon icon={faEdit} />}
                        />
                    </Tooltip>
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
            <CommentsSection ticket={ticket} />
        </Container>
    );
}

export default TicketDetailsIndex;