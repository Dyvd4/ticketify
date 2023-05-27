import { Select } from "@chakra-ui/react";
import { TSortDirection } from ".";
import { sortDirections } from "../data/directions";

type SortDirectionsProps = {
    direction?: TSortDirection;
    className?: string;
    disabled?: boolean;
    onSelect?(value);
};

function SortDirections({ className, disabled, direction, ...props }: SortDirectionsProps) {
    return (
        <Select
            disabled={disabled}
            className={className}
            onChange={(e) =>
                props.onSelect && props.onSelect((e.target as HTMLSelectElement).value)
            }
        >
            {Array.from(sortDirections.values()).map((operation, index) => (
                <option
                    selected={operation.value === direction?.value}
                    key={index}
                    value={operation.value}
                >
                    {operation.label}
                </option>
            ))}
        </Select>
    );
}

export default SortDirections;
