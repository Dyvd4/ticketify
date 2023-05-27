import { Flex, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

function CommentSkeleton() {
    return (
        <Flex className="comment" gap={3}>
            <SkeletonCircle width={"3rem"} height={"3rem"} className="flex-shrink-0" />
            <Flex flexDirection={"column"} className="w-full">
                <Flex position={"relative"} flexDirection={"column"}>
                    <Skeleton maxWidth={"fit-content"} height={"13px"}>
                        Some username
                    </Skeleton>
                    <SkeletonText mt={2} noOfLines={4} />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default CommentSkeleton;
