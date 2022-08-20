import { FormControl, FormLabel, VisuallyHidden } from "@chakra-ui/react";
import { useId } from "react";
import FilterInput from "./FilterInput";
import FilterOperations, { FilterOperation, FilterOperationsType } from "./FilterOperations";

export type FilterItemType = FilterItemProps

export type FilterItemProps = {
    label?: string
    property: string
    type: FilterOperationsType
    value?: string
    operation?: FilterOperation
}

function FilterItem({ ...item }: FilterItemProps) {
    const inputId = useId();
    return (
        <FormControl>
            <VisuallyHidden className={`filter-item-props-${inputId}`}>
                properties that are not dynamically changed
                (will be picked up by useFilterParams)
                <input name="label" value={item.label} />
                <input name="type" value={item.type} />
                <input name="property" value={item.property} />
            </VisuallyHidden>
            {item.label && <>
                <FormLabel>{item.label}</FormLabel>
            </>}
            <div className="flex items-center gap-2">
                <FilterInput
                    name={item.property}
                    type={item.type}
                    defaultValue={item.value}
                    id={inputId}
                />
                <FilterOperations
                    operation={item.operation}
                    type={item.type}
                    for={inputId}
                />
            </div>
        </FormControl>
    );
}

export default FilterItem;