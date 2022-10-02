import { Checkbox, Input } from "@chakra-ui/react";
import { TFilterOperations } from "../../";

type FilterInputProps = {
    onChange(value): void
    name: string
    type: TFilterOperations
    value?
    disabled?: boolean
}

function FilterInput({ type, name, value, disabled, ...props }: FilterInputProps) {

    const parseFilterItemValue = (value) => {
        switch (type) {
            case "boolean":
                return Boolean(value)
            default:
                return value
        }
    }
    const parseInputValue = (e) => {
        switch (type) {
            case "number":
                return parseInt(e.target.value)
            case "boolean":
                return e.target.checked ? 1 : 0
            default:
                return e.target.value
        }
    }
    const handleChange = e => {
        props.onChange(parseInputValue(e));
    }

    const parsedValue = parseFilterItemValue(value);

    switch (type) {
        case "number":
            return (
                <Input
                    onChange={handleChange}
                    type="number"
                    name={name}
                    value={parsedValue}
                    disabled={disabled}
                />
            )
        case "date":
            return (
                <Input
                    onChange={handleChange}
                    type="datetime-local"
                    name={name}
                    value={parsedValue}
                    disabled={disabled}
                />
            )
        case "boolean":
            return (
                <Checkbox
                    onChange={handleChange}
                    name={name}
                    isChecked={parsedValue}
                    disabled={disabled}
                />
            )
        default:
            return (
                <Input
                    onChange={handleChange}
                    type="text"
                    name={name}
                    value={parsedValue}
                    disabled={disabled}
                />
            )
    }
}

export default FilterInput;