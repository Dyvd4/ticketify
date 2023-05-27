import { Box } from "@chakra-ui/react";
import { format } from "date-fns";

function TicketListItemContent({ item }: { item }) {
    return (
        <Box>
            <Box>
                <span className="mr-2">Responsible user:</span>
                <span>
                    {!!item.responsibleUser && <>{item.responsibleUser.username}</>}
                    {!item.responsibleUser && "-"}
                </span>
            </Box>
            <Box>
                <span className="mr-2">Due date:</span>
                <span>
                    {item.dueDate && <>{format(new Date(item.dueDate), "dd.MM.yy, HH:mm:ss")}</>}
                    {!item.dueDate && "-"}
                </span>
            </Box>
            <Box>
                <span className="mr-2">Created at:</span>
                <span>
                    {item.createdAt && (
                        <>{format(new Date(item.createdAt), "dd.MM.yy, HH:mm:ss")}</>
                    )}
                    {!item.createdAt && "-"}
                </span>
            </Box>
        </Box>
    );
}

export default TicketListItemContent;
