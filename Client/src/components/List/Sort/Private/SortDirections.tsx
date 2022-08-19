import { Select } from "@chakra-ui/react";

// todo: different operations based on type?
const sortDirections = [
    {
        label: "ascending",
        value: "asc"
    },
    {
        label: "descending",
        value: "desc"
    }
]

type SortDirectionsProps = {
    /** the name of the input which the operation is for */
    for: string
    direction?: "asc" | "desc"
    className?: string
    disabled?: boolean
    onSelect?(value)
}

function SortDirections({ for: forProp, className, disabled, direction, ...props }: SortDirectionsProps) {
    return (
        <Select disabled={disabled} name={`sort-directions-${forProp}`}
            className={className}
            onChange={(e) => props.onSelect && props.onSelect((e.target as HTMLSelectElement).value)}>
            {sortDirections.map((operation, index) => (
                <option selected={operation.value === direction} key={index} value={operation.value}>{operation.label}</option>
            ))}
        </Select>
    );
}

export default SortDirections;