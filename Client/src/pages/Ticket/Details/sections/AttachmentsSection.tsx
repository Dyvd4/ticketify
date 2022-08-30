import { Box, Flex, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip } from "@chakra-ui/react";
import { faAdd, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "src/components/Wrapper/IconButton";
import Attachments from "../components/Attachments";

type AttachmentsProps = {
    images: any[]
    files: any[]
    onEdit(...args: any[]): void
    onAdd(...args: any[]): void
}

function AttachmentsSection({ images, files, ...props }: AttachmentsProps) {
    return (
        <Flex direction="column" className="my-2">
            <Tabs defaultIndex={images.length === 0 && files.length > 0 ? 1 : 0}>
                <TabList>
                    <Tab>
                        <Heading as="h3" size="md">
                            images ({images.length})
                        </Heading>
                    </Tab>
                    <Tab>
                        <Heading as="h3" size="md">
                            files ({files.length})
                        </Heading>
                    </Tab>
                    <Box className="flex flex-1 justify-end items-center gap-2">
                        {images.concat(files).length > 0 && <>
                            <Tooltip label="edit" placement="top">
                                <IconButton
                                    size={"sm"}
                                    onClick={props.onEdit}
                                    aria-label="edit"
                                    icon={<FontAwesomeIcon icon={faEdit} />}
                                />
                            </Tooltip>
                        </>}
                        <Tooltip label="add" placement="top">
                            <IconButton
                                size={"sm"}
                                onClick={props.onAdd}
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