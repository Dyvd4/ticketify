import { Alert, AlertIcon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { faChevronRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import EditBlock from "src/components/EditBlock";
import EditModalBlock from "src/components/EditModalBlock";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import AttachmentsEditSection from "./sections/AttachmentsEditSection";
import AttachmentsSection from "./sections/AttachmentsSection";
import CommentsSection from "./sections/CommentsSection";
import HeadDataSection from "./sections/HeadDataSection";
import TicketFormModal from "src/components/FormModals/Ticket";

function TicketDetailsIndex() {
    // state
    // -----
    const [editAttachments, setEditAttachments] = useState(false);
    // refs
    // ----
    const headDataEditButtonRef = useRef<HTMLButtonElement | null>(null);
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
                            ref={headDataEditButtonRef}
                            size={"sm"}
                            aria-label={"edit"}
                            icon={<FontAwesomeIcon icon={faEdit} />}
                        />
                    </Tooltip>
                }>
                <HeadDataSection ticket={ticket} />
            </EditModalBlock>
            <TicketFormModal
                id={id}
                mountButtonRef={headDataEditButtonRef}
                variant="edit"
            />
            <EditBlock
                className="mt-4"
                title="Attachments"
                onToggle={() => setEditAttachments(!editAttachments)}
                disableEdit={images.concat(files).length === 0}
                edit={editAttachments}
                alternateView={
                    <AttachmentsSection
                        images={images}
                        files={files}
                    />
                }>
                <AttachmentsEditSection attachments={attachments} />
            </EditBlock>
            <CommentsSection ticket={ticket} />
        </Container>
    );
}

export default TicketDetailsIndex;