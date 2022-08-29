import { Alert, AlertIcon, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Container, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text } from "@chakra-ui/react";
import { faChevronRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns/esm";
import { sanitize } from "dompurify";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchEntity } from "src/api/entity";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import IconButton from "src/components/Wrapper/IconButton";
import Attachments from "./Attachments";

function TicketDetailsIndex() {
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
        title,
        description,
        responsibleUser,
        dueDate,
        priority,
        status,
        comments = [],
        files = [],
        images = [],

    } = data;

    return (
        <Container className="mt-4">
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
                {/* head data */}
                <Flex justifyContent="space-between">
                    <Heading as="h1" className="font-bold">
                        {title}
                    </Heading>
                    <IconButton
                        size={"sm"}
                        onClick={() => console.log("edit")}
                        aria-label="edit"
                        icon={<FontAwesomeIcon icon={faEdit} />}
                    />
                </Flex>
                <Flex
                    direction="column"
                    className="my-2 font-bold text-gray-700 dark:text-gray-300">
                    <Flex justifyContent="space-between">
                        <div>priority</div>
                        <Tag
                            style={{ backgroundColor: priority.color }}
                            variant="solid">
                            {priority.name}
                        </Tag>
                    </Flex>
                    {status && <>
                        <Flex justifyContent="space-between">
                            <div>status</div>
                            <Tag
                                style={{ backgroundColor: status.color }}
                                variant="solid">
                                {status.name}
                            </Tag>
                        </Flex>
                    </>}
                    <Flex justifyContent="space-between">
                        <div>due date</div>
                        <div>{format(new Date(dueDate), "dd.mm.yyyy hh:mm:ss")}</div>
                    </Flex>
                    {responsibleUser && <>
                        <Flex justifyContent="space-between">
                            <div>responsible user</div>
                            <div>{responsibleUser}</div>
                        </Flex>
                    </>}
                </Flex>
                {/* description */}
                <Flex direction="column" className="my-2">
                    <Text
                        className="bg-white dark:bg-gray-800 p-2 rounded-md"
                        dangerouslySetInnerHTML={{ __html: sanitize(description) }} />
                </Flex>
                {/* attachments */}
                <Flex direction="column" className="my-2">
                    <Tabs isFitted>
                        <TabList>
                            <Tab>
                                <Heading as="h3" size="md" className="mb-1">
                                    images ({images.length})
                                </Heading>
                            </Tab>
                            <Tab>
                                <Heading as="h3" size="md" className="mb-1">
                                    files ({files.length})
                                </Heading>
                            </Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Attachments attachments={images} variant="images" />
                            </TabPanel>
                            <TabPanel>
                                <Attachments attachments={files} variant="files" />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Flex>
            </Box>
            {/* comments */}
            <Flex direction="column" className="my-2">
                <Heading as="h3" size="md">
                    comments ({comments.length})
                </Heading>
            </Flex>
        </Container>
    );
}

export default TicketDetailsIndex;