import { Alert, AlertIcon, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Text } from "@chakra-ui/react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import EditView from "src/components/EditView";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import AttachmentsAddSection from "./sections/AttachmentsAddSection";
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
    const [addAttachments, setAddAttachments] = useState(false);
    // queries
    // -------
    const { id } = useParams();
    const { isLoading, isError, data, refetch } = useQuery(["ticket", id], () => fetchEntity({ route: `ticket/${id}` }));

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
        <Container className="mt-4" maxW="container.lg">
            <Box className="bg-gray-200 dark:bg-gray-700 rounded-md p-6">
                <Breadcrumb
                    className="text-gray-700 dark:text-gray-300 font-bold"
                    separator={<FontAwesomeIcon icon={faChevronRight} size="xs" />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#" isCurrentPage>
                            Details
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <EditView
                    edit={edit}
                    editView={
                        <HeadDataEditSection
                            ticket={{ ...ticket, ...editedTicket }}
                            setTicket={setEditedTicket}
                            onSuccess={() => { setEdit(false); refetch() }}
                            onAbort={() => setEdit(false)}
                        />
                    }>
                    <HeadDataSection
                        onEdit={() => setEdit(true)}
                        ticket={ticket}
                    />
                </EditView>
                {/* 🥵 */}
                <EditView
                    edit={editAttachments || addAttachments}
                    editView={<>
                        {editAttachments && <>
                            <AttachmentsEditSection
                                onRemoved={() => refetch()}
                                onDone={() => { setEditAttachments(false); refetch() }}
                                ticketId={ticket.id}
                                attachments={attachments}
                            />
                        </>}
                        {addAttachments && <>
                            <AttachmentsAddSection
                                onSuccess={() => { setAddAttachments(false); refetch() }}
                                onAbort={() => setAddAttachments(false)}
                                ticketId={ticket.id}
                            />
                        </>}
                    </>
                    }>
                    <AttachmentsSection
                        onAdd={() => setAddAttachments(true)}
                        onEdit={() => setEditAttachments(true)}
                        images={images}
                        files={files}
                    />
                </EditView>
            </Box>
            <CommentsSection ticket={ticket} />
        </Container>
    );
}

export default TicketDetailsIndex;