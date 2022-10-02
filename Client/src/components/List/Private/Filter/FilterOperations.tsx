import { Select } from "@chakra-ui/react";
import { TFilterOperation, TFilterOperations } from "../../";
import { typeOperations } from "./data/operations";

type FilterOperationsProps = {
    onChange(value): void
    type: TFilterOperations
    operation?: TFilterOperation
    disabled?: boolean
}

function FilterOperations(props: FilterOperationsProps) {
    return (
        <Select
            onChange={e => props.onChange(e.target.value)}
            disabled={props.disabled}>
            {typeOperations[props.type].map((operation, index) => (
                <option
                    selected={operation.value === props.operation?.value}
                    key={index}
                    value={operation.value}>
                    {operation.label}
                </option>
            ))}
        </Select>
    );
}

export default FilterOperations;