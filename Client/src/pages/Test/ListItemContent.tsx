import { Checkbox, Heading } from "@chakra-ui/react";
import { format } from "date-fns";


function TicketListItemContent({ item }: { item }) {
    return (
        <div className="flex justify-between items-center gap-2">
            <div>
                <Heading as="h1" size="md">
                    {item.description}
                </Heading>
                <Checkbox readOnly defaultChecked={item.isAmazing}>Is amazing</Checkbox>
            </div>
            <div>
                {format(new Date(item.createdAt), "dd.MM.yy HH:mm:ss")}
            </div>
        </div>
    );
}

export default TicketListItemContent;