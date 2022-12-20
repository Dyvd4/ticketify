import { Box, Tag } from "@chakra-ui/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation, faCircleInfo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { useRef, useState } from "react";
import ListItem from "src/components/List/ListItem";
import ShowMoreLabel from "src/components/ShowMoreLabel";

[faCircleExclamation, faTriangleExclamation, faCircleInfo].forEach(icon => library.add(icon))

const defaultNoOfContentLines = 3;

function LogListItemContent({ item }: { item }) {

    const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);
    const { level, colorScheme, message, errorMessage, errorStack, createdAt } = item;
    const contentRef = useRef<HTMLDivElement | null>(null);

    return (
        <ListItem
            heading={
                <Box className="flex items-center justify-between">
                    <Tag colorScheme={colorScheme}>
                        {level}
                    </Tag>
                    <Box>
                        {format(new Date(createdAt), "dd.MM.yyyy HH:mm:ss")}
                    </Box>
                </Box>
            }
            content={
                <Box>
                    <Box
                        ref={contentRef}
                        className="mt-2"
                        noOfLines={noOfContentLines}>
                        <Box>
                            <b>Message: </b>
                            <span className="text-secondary">{message}</span>
                        </Box>
                        {errorMessage && <>
                            <Box>
                                <div className="mt-1 mb-2">
                                    <b>Error message: </b>
                                </div>
                                <span className="text-secondary">{errorMessage}</span>
                            </Box>
                        </>}
                        {errorStack && <>
                            <Box>
                                <div className="mt-1 mb-2">
                                    <b>
                                        Error stack:
                                    </b>
                                </div>
                                <div className="text-secondary">{errorStack}</div>
                            </Box>
                        </>}
                    </Box>
                    <ShowMoreLabel
                        contentRef={contentRef}
                        contentNoOfLines={noOfContentLines}
                        setContentNoOfLines={setNoOfContentLines}
                        defaultContentNoOfLines={defaultNoOfContentLines}
                    />
                </Box>
            } />
    );
}

export default LogListItemContent;