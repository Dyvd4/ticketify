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
}

function SortDirections(props: SortDirectionsProps) {
    return (
        <Select name={`sort-directions-${props.for}`}>
            {sortDirections.map((operation, index) => (
                <option key={index} value={operation.value}>{operation.label}</option>
            ))}
        </Select>
    );
}

export default SortDirections;