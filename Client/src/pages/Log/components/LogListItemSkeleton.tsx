import { Box, Skeleton, SkeletonText, Tag } from "@chakra-ui/react";
import { format } from "date-fns";
import ListItem from "src/components/List/ListItem";

function LogListItemSkeleton() {
	return (
		<ListItem
			heading={
				<Box className="flex items-center justify-between">
					<Skeleton className="h-4 rounded-md">
						<Tag>level</Tag>
					</Skeleton>
					<Skeleton className="h-4 rounded-md">
						<Box>{format(new Date(), "dd.MM.yyyy HH:mm:ss")}</Box>
					</Skeleton>
				</Box>
			}
			content={
				<Box>
					<SkeletonText noOfLines={5} className="my-4" />
					<Skeleton maxWidth={"fit-content"} className="h-4 rounded-md">
						Show more
					</Skeleton>
				</Box>
			}
		/>
	);
}

export default LogListItemSkeleton;
