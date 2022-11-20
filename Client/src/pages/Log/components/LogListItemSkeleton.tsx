import { Box, Skeleton, SkeletonText, Tag } from "@chakra-ui/react";
import { format } from "date-fns";
import ListItem from "src/components/List/ListItem";
import ShowMore from "src/components/ShowMore";

function LogListItemSkeleton() {
    return (
        <ListItem
            content={
                <Box>
                    <Box className="flex items-center justify-between">
                        <Skeleton className="rounded-md h-4">
                            <Tag>
                                level
                            </Tag>
                        </Skeleton>
                        <Skeleton className="rounded-md h-4">
                            <Box>
                                {format(new Date(), "dd.MM.yyyy HH:mm:ss")}
                            </Box>
                        </Skeleton>
                    </Box>
                    <SkeletonText noOfLines={5} className="my-4" />
                    <Skeleton maxWidth={"fit-content"} className="rounded-md h-4">
                        <ShowMore showMore={true} />
                    </Skeleton>
                </Box>
            } />
    );
}

export default LogListItemSkeleton;