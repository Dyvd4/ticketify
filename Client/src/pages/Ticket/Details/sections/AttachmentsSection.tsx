import { Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Attachments from "../components/Attachments";

type AttachmentsProps = {
    images: any[]
    files: any[]
}

function Index({ images, files, ...props }: AttachmentsProps) {
    return (
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
    );
}

export default Index;