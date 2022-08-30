import { Box, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip } from "@chakra-ui/react";
import { faAdd, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "src/components/Wrapper/IconButton";
import Attachments from "./Attachments";

type AttachmentsProps = {
    images: any[]
    files: any[]
}

function AttachmentsSection({ images, files }: AttachmentsProps) {
    return (
        <Flex direction="column" className="my-2">
            <Tabs defaultIndex={images.length > files.length ? 0 : 1}>
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
                    <Box className="flex flex-1 justify-end items-center gap-2">
                        <Tooltip label="edit" placement="top">
                            <IconButton
                                size={"sm"}
                                onClick={() => console.log("edit")}
                                aria-label="edit"
                                icon={<FontAwesomeIcon icon={faEdit} />}
                            />
                        </Tooltip>
                        <Tooltip label="add" placement="top">
                            <IconButton
                                size={"sm"}
                                onClick={() => console.log("add")}
                                aria-label="add"
                                icon={<FontAwesomeIcon icon={faAdd} />}
                            />
                        </Tooltip>
                    </Box>
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
    );
}

export default AttachmentsSection;