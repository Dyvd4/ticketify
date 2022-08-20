import { Checkbox, Input } from "@chakra-ui/react";
import { FilterOperationsType } from "./FilterOperations";

type FilterInputProps = {
    id: string
    name: string
    type: FilterOperationsType
    defaultValue?
}

function FilterInput({ type, name, defaultValue, id }: FilterInputProps) {
    switch (type) {
        case "number":
            return <Input type="number" name={name} defaultValue={defaultValue} id={id} />
        case "date":
            return <Input type="date" name={name} defaultValue={defaultValue} id={id} />
        case "boolean":
            return <Checkbox name={name} defaultValue={defaultValue} id={id} />
        default:
            return <Input type="text" name={name} defaultValue={defaultValue} id={id} />
    }
}

export default FilterInput;