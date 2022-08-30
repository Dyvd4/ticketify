import { Flex, Heading, Tag, Tooltip, Text } from "@chakra-ui/react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import format from "date-fns/format";
import { sanitize } from "dompurify";
import IconButton from "src/components/Wrapper/IconButton";

type HeadDataProps = {
    ticket: any
    onEdit(...args: any[]): void
}

function HeadDataSection({ ticket, ...props }: HeadDataProps) {
    const {
        title,
        priority,
        status, dueDate,
        responsibleUser,
        description
    } = ticket;
    return (
        <>
            <Flex justifyContent="space-between">
                <Heading as="h1" className="font-bold">
                    {title}
                </Heading>
                <Tooltip label="edit" placement="top">
                    <IconButton
                        size={"sm"}
                        onClick={props.onEdit}
                        aria-label="edit"
                        icon={<FontAwesomeIcon icon={faEdit} />}
                    />
                </Tooltip>
            </Flex>
            <Flex
                direction="column"
                className="my-2 font-bold text-gray-700 dark:text-gray-300">
                <Flex justifyContent="space-between">
                    <div>priority</div>
                    <Tag
                        style={{ backgroundColor: priority.color }}
                        variant="solid">
                        {priority.name}
                    </Tag>
                </Flex>
                {status && <>
                    <Flex justifyContent="space-between">
                        <div>status</div>
                        <Tag
                            style={{ backgroundColor: status.color }}
                            variant="solid">
                            {status.name}
                        </Tag>
                    </Flex>
                </>}
                <Flex justifyContent="space-between">
                    <div>due date</div>
                    <div>{format(new Date(dueDate), "dd.mm.yyyy hh:mm:ss")}</div>
                </Flex>
                {responsibleUser && <>
                    <Flex justifyContent="space-between">
                        <div>responsible user</div>
                        <div>{responsibleUser.username}</div>
                    </Flex>
                </>}
            </Flex>
            <Flex direction="column" className="my-2">
                <Text
                    className="bg-white dark:bg-gray-800 p-2 rounded-md"
                    dangerouslySetInnerHTML={{ __html: sanitize(description) }} />
            </Flex>
        </>
    );
}

export default HeadDataSection;