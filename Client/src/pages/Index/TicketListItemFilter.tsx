import { FormLabel, Input } from "@chakra-ui/react";
import FilterOperations from "src/components/List/Filter/FilterOperations";
import FormControl from "src/components/Wrapper/FormControl";

function TicketListItemFilter() {
    return (
        <>
            <FormControl>
                <FormLabel>Title</FormLabel>
                <div className="flex gap-2">
                    <Input name="title" type="text" />
                    <FilterOperations for="title" />
                </div>
            </FormControl>
        </>
    );
}

export default TicketListItemFilter;