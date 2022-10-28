import { Alert, AlertIcon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, IconButton, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { faChevronRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import EditModalBlock from "src/components/EditModalBlock";
import TicketFormModal from "src/components/FormModals/Ticket";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import AttachmentsEditModal from "./modals/AttachmentsEditModal";
import AttachmentsSection from "./sections/AttachmentsSection";
import CommentsSection from "./sections/CommentsSection";
import HeadDataSection from "./sections/HeadDataSection";

function TicketDetailsIndex() {
    // state
    // -----
    const { isOpen: ticketFormModalIsOpen, onOpen: onTicketFormModalOpen, onClose: onTicketFormModalClose } = useDisclosure();
    const { isOpen: attachmentsEditModalIsOpen, onOpen: onAttachmentsEditModalOpen, onClose: onAttachmentsEditModalClose } = useDisclosure();
    // queries
    // -------
    const { id } = useParams();
    const { isLoading, isError, data } = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

    if (isLoading) {
        return <LoadingRipple centered />
    }

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
        ...ticket
    } = data;

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
            <EditModalBlock
                title="Head data"
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
            </EditModalBlock>
            <EditModalBlock
                className="mt-4"
                title="Attachments"
                editButton={
                    <Tooltip
                        label={"edit"}
                        placement="top">
                        <IconButton
                            onClick={onAttachmentsEditModalOpen}
                            disabled={images.concat(files).length === 0}
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
            </EditModalBlock>
            <CommentsSection ticket={ticket} />
        </Container>
    );
}

export default TicketDetailsIndex;