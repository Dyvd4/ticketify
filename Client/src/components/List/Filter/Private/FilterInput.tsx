import { Checkbox, Input } from "@chakra-ui/react";
import { FilterOperationsType } from "./FilterOperations";

type FilterInputProps = {
    id: string
    name: string
    type: FilterOperationsType
    defaultValue?
    disabled?: boolean
}

function FilterInput({ type, name, defaultValue, id, disabled }: FilterInputProps) {
    const parseFilterValue = (value, type: FilterOperationsType) => {
        switch (type) {
            case "boolean":
                return Boolean(value)
            default:
                return value
        }
    }
    const parsedDefaultValue = parseFilterValue(defaultValue, type);
    switch (type) {
        case "number":
            return <Input type="number" name={name} defaultValue={parsedDefaultValue} id={id} disabled={disabled} />
        case "date":
            return <Input type="datetime-local" name={name} defaultValue={parsedDefaultValue} id={id} disabled={disabled} />
        case "boolean":
            return <Checkbox name={name} defaultChecked={parsedDefaultValue} id={id} disabled={disabled} />
        default:
            return <Input type="text" name={name} defaultValue={parsedDefaultValue} id={id} disabled={disabled} />
    }
}

export default FilterInput;