import { Heading, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import { format } from "date-fns";

function TicketListItemContent({ item }: { item }) {
    return (
        <LinkBox className="flex justify-between items-center gap-4">
            <div className="flex justify-center items-center gap-2 min-w-0">
                <div className={`rounded-full h-4 w-4 bg-${item.priority.color} flex-shrink-0`}></div>
                {/* 😢 */}
                <LinkOverlay
                    title={item.title}
                    className="overflow-hidden"
                    href={`/Ticket/Details/${item.id}`}>
                    <Heading
                        style={{ textOverflow: "ellipsis" }}
                        as="h1"
                        className="text-lg sm:text-xl
                                   whitespace-nowrap overflow-hidden">
                        {item.title}
                    </Heading>
                </LinkOverlay>
            </div>
            {item.dueDate && <>
                <Text className="text-xs sm:text-base flex-shrink-0">
                    {format(new Date(item.dueDate), "dd.MM.yy HH:mm:ss")}
                </Text>
            </>}
        </LinkBox>
    );
}

export default TicketListItemContent;