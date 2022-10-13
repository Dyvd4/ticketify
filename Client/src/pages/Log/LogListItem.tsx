import { Box, Tag } from "@chakra-ui/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation, faCircleInfo, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { useRef, useState } from "react";
import ListItem from "src/components/List/ListItem";
import ShowMore from "src/components/ShowMore";
import useHasOverflow from "src/hooks/useHasOverflow";

[faCircleExclamation, faTriangleExclamation, faCircleInfo].forEach(icon => library.add(icon))

const defaultNoOfContentLines = 3;

function LogListItemContent({ item }: { item }) {

    const [noOfContentLines, setNoOfContentLines] = useState(defaultNoOfContentLines);
    const { level, colorScheme, message, errorMessage, errorStack, createdAt } = item;
    const contentRef = useRef<HTMLDivElement | null>(null);
    const contentHasOverflow = useHasOverflow(contentRef);
    const showMore = noOfContentLines === defaultNoOfContentLines;

    return (
        <ListItem
            content={
                <Box>
                    <Box className="flex items-center justify-between">
                        <Tag colorScheme={colorScheme}>
                            {level}
                        </Tag>
                        <Box>
                            {format(new Date(createdAt), "dd.MM.yyyy HH:mm:ss")}
                        </Box>
                    </Box>
                    <Box
                        ref={contentRef}
                        className="mt-2"
                        noOfLines={noOfContentLines}>
                        <Box>
                            <b>Message: </b>
                            <span className="text-gray-300">{message}</span>
                        </Box>
                        {errorMessage && <>
                            <Box>
                                <div className="mt-1 mb-2">
                                    <b>Error message: </b>
                                </div>
                                <span className="text-gray-300">{errorMessage}</span>
                            </Box>
                        </>}
                        {errorStack && <>
                            <Box>
                                <div className="mt-1 mb-2">
                                    <b>
                                        Error stack:
                                    </b>
                                </div>
                                <div className="text-gray-300">{errorStack}</div>
                            </Box>
                        </>}
                    </Box>
                    {contentHasOverflow && <>
                        <ShowMore
                            onClick={() => setNoOfContentLines(showMore ? 100000000000 : defaultNoOfContentLines)}
                            showMore={showMore}
                        />
                    </>}
                </Box>
            } />
    );
}

export default LogListItemContent;