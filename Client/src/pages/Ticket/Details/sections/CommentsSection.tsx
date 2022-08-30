import { Flex, Heading } from "@chakra-ui/react";

type CommentsSectionProps = {
    comments: any[]
}

function CommentsSection({ comments }: CommentsSectionProps) {
    return (
        <Flex direction="column" className="my-2">
            <Heading as="h3" size="md">
                comments ({comments.length})
            </Heading>
        </Flex>
    );
}

export default CommentsSection;