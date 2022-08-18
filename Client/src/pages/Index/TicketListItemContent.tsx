import { Heading, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import { format } from "date-fns";


function TicketListItemContent({ item }: { item }) {
    return (
        <LinkBox className="flex justify-between items-center gap-4">
            <div className="flex justify-center items-center gap-2">
                <div style={{ backgroundColor: item.priority.color }} className={`rounded-full h-8 w-8`}></div>
                <Heading as="h1">
                    <LinkOverlay href="/Ticket/Details">
                        {item.title}
                    </LinkOverlay>
                </Heading>
            </div>
            {item.dueDate && <>
                <Text>
                    {format(new Date(item.dueDate), "dd.MM.yy HH:mm:ss")}
                </Text>
            </>}
        </LinkBox>
    );
}

export default TicketListItemContent;