import { Flex, Heading, Tag } from "@chakra-ui/react";
import format from "date-fns/format";
import { sanitize } from "dompurify";
import BgBox from "src/components/BgBox";
import { CONTENTSTATE } from "src/components/RichText/Editor";

type HeadDataProps = {
    ticket: any
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
            <Heading as="h1" className="font-bold text-xl">
                {`#${ticket.id} ${title}`}
            </Heading>
            <Flex
                gap={2}
                direction="column"
                className="my-2 text-secondary">
                <Flex justifyContent="space-between">
                    <div>priority</div>
                    <Tag
                        className={`bg-${priority.color || "slate-500"}`}
                        variant="solid">
                        {priority.name}
                    </Tag>
                </Flex>
                <Flex justifyContent="space-between">
                    <div>status</div>
                    <Tag
                        className={`bg-${status?.color || "slate-500"}`}
                        variant="solid">
                        {status?.name || "none"}
                    </Tag>
                </Flex>
                <Flex justifyContent="space-between">
                    <div>due date</div>
                    <div>{dueDate
                        ? format(new Date(dueDate), "dd.mm.yyyy hh:mm:ss")
                        : "-"}</div>
                </Flex>
                <Flex justifyContent="space-between">
                    <div>responsible user</div>
                    <div>{responsibleUser?.username || "-"}</div>
                </Flex>
            </Flex>
            <Flex direction="column" className="my-2">
                <BgBox
                    variant="child"
                    dangerouslySetInnerHTML={{ __html: sanitize(description === CONTENTSTATE.EMPTY ? "No description" : description) }} />
            </Flex>
        </>
    );
}

export default HeadDataSection;