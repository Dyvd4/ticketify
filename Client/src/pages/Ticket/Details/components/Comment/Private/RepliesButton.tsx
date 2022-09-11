import { Avatar, Box, Flex } from "@chakra-ui/react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef, useState } from "react";
import { actionTextColor } from "src/data/tailwind";
import { mapColorProps } from "src/utils/component";
import { getDataUrl } from "src/utils/image";
import Comment from "../Comment";

type RepliesButtonProps = {
    ticket: any
    comments: any[]
} & ComponentPropsWithRef<"div">

function RepliesButton(props: RepliesButtonProps) {
    
    const { comments, ticket, ...restProps } = props;
    const [active, setActive] = useState(false);
    const responsibleUserHasReplied = comments.some(comment => comment.authorId === ticket.responsibleUserId);
    const responsibleUser = responsibleUserHasReplied
        ? ticket.responsibleUser
        : null;

    return (
        <Box {...restProps}>
            <Flex
                onClick={() => setActive(!active)}
                gap={1}
                alignItems={"center"}
                className={`cursor-pointer uppercase select-none 
                            font-bold text-sm
                            ${mapColorProps([actionTextColor])}`}>
                <FontAwesomeIcon icon={active ? faCaretUp : faCaretDown} />
                {responsibleUserHasReplied && responsibleUser && <>
                    <Avatar
                        className="ml-2"
                        name={responsibleUser.username}
                        src={getDataUrl(responsibleUser.avatar.content, responsibleUser.avatar.mimeType)}
                        size={"2xs"}
                    />
                </>}
                <div className="ml-2">
                    {comments.length}
                </div>
                <div>
                    replies
                </div>
            </Flex>
            {active && <>
                <Flex
                    className="mt-2"
                    direction={"column"}
                    gap={2}>
                    {comments.map(comment => (
                        <Comment
                            ticket={ticket}
                            size="small"
                            key={comment.id}
                            comment={comment}
                        />
                    ))}
                </Flex>
            </>}
        </Box>
    );
}

export default RepliesButton;