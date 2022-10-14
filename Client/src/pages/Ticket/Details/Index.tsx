import { Alert, AlertIcon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Text } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import EditBlock from "src/components/EditBlock";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import AttachmentsEditSection from "./sections/AttachmentsEditSection";
import AttachmentsSection from "./sections/AttachmentsSection";
import CommentsSection from "./sections/CommentsSection";
import HeadDataEditSection from "./sections/HeadDataEditSection";
import HeadDataSection from "./sections/HeadDataSection";

function TicketDetailsIndex() {
    // state
    // -----
    const [editedTicket, setEditedTicket] = useState<any>();
    const [edit, setEdit] = useState(false);
    const [editAttachments, setEditAttachments] = useState(false);
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
            <EditBlock
                onSave={() => { }}
                title="Head data"
                onToggle={() => setEdit(!edit)}
                edit={edit}
                alternateView={
                    <HeadDataSection ticket={ticket} />
                }>
                <HeadDataEditSection
                    ticket={{ ...ticket, ...editedTicket }}
                    setTicket={setEditedTicket}
                    onSuccess={() => setEdit(false)}
                    onAbort={() => setEdit(false)}
                />
            </EditBlock>
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