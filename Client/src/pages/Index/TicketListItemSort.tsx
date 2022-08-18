import { Input } from "@chakra-ui/react";
import SortDirections from "src/components/List/SortDirections";
import FormControl from "src/components/Wrapper/FormControl";

function TicketListItemSort() {
    return (
        <FormControl>
            <div className="flex gap-2">
                <Input readOnly name="title" type="text" value="title" />
                <SortDirections for="title" />
            </div>
        </FormControl>
    );
}

export default TicketListItemSort;