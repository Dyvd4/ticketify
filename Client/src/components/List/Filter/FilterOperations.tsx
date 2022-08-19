import { Select } from "@chakra-ui/react";

// todo: different operations based on type?
const filterOperations = [
    {
        label: "contains",
        value: "contains"
    },
    {
        label: "equals",
        value: "equals"
    },
    {
        label: "greater than",
        value: "gt"
    },
    {
        label: "less than",
        value: "lt"
    }
]

type FilterOperationsProps = {
    /** the name of the input which the operation is for */
    for: string
}

function FilterOperations(props: FilterOperationsProps) {
    return (
        <Select name={`filter-operations-${props.for}`}>
            {filterOperations.map((operation, index) => (
                <option key={index} value={operation.value}>{operation.label}</option>
            ))}
        </Select>
    );
}

export default FilterOperations;