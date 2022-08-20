import { Select } from "@chakra-ui/react";

export type FilterOperationsType = "string" | "number" | "date" | "boolean"

export type FilterOperation = {
    label: string
    value: string
}

const operations = {
    contains: {
        label: "contains",
        value: "contains"
    },
    equals: {
        label: "equals",
        value: "equals"
    },
    startsWith: {
        label: "starts with",
        value: "startsWith"
    },
    endsWith: {
        label: "ends with",
        value: "endsWith"
    },
    gt: {
        label: "greater than",
        value: "gt"
    },
    gte: {
        label: "greather than or equal",
        value: "gte"
    },
    lt: {
        label: "less than",
        value: "lt"
    },
    lte: {
        label: "less than or equal",
        value: "lte"
    },
    not: {
        label: "not",
        value: "not"
    }
}

const typeOperations = {
    string: [
        operations.contains,
        operations.equals,
        operations.not,
        operations.startsWith,
        operations.endsWith
    ],
    number: [
        operations.lt,
        operations.gt,
        operations.not,
        operations.gte,
        operations.lte
    ],
    date: [
        operations.equals,
        operations.lt,
        operations.gt,
        operations.not,
        operations.gte,
        operations.lte
    ],
    boolean: [
        operations.equals,
        operations.not
    ]
}

type FilterOperationsProps = {
    /** the name of the input which the operation is for */
    for: string
    type: FilterOperationsType
    operation?: FilterOperation
    disabled?: boolean
}

function FilterOperations(props: FilterOperationsProps) {
    return (
        <Select name={`filter-operations-${props.for}`} disabled={props.disabled}>
            {typeOperations[props.type].map((operation, index) => (
                <option selected={operation.value === props.operation?.value} key={index} value={operation.value}>{operation.label}</option>
            ))}
        </Select>
    );
}

export default FilterOperations;