import { FormControl, FormLabel, IconButton, Tooltip, VisuallyHidden } from "@chakra-ui/react";
import { faBan, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    disabled?: boolean
    onChange(...args)
}

function FilterItem({ onChange, ...item }: FilterItemProps) {
    const inputId = useId();
    return (
        <FormControl>
            <VisuallyHidden className={`filter-item-props-${inputId}`}>
                properties that are not dynamically changed
                (will be picked up by useFilterParams)
                <input readOnly name="label" value={item.label} />
                <input readOnly name="type" value={item.type} />
                <input readOnly name="property" value={item.property} />
            </VisuallyHidden>
            <FormLabel>{item.label || item.property}</FormLabel>
            <div className="flex items-center gap-2">
                <FilterInput
                    name={item.property}
                    type={item.type}
                    defaultValue={item.value}
                    id={inputId}
                    disabled={item.disabled}
                />
                <FilterOperations
                    operation={item.operation}
                    type={item.type}
                    for={inputId}
                    disabled={item.disabled}
                />
                <Tooltip label={item.disabled ? "enable" : "disable"} placement="top">
                    <IconButton
                        size="xs"
                        aria-label="disable"
                        icon={<FontAwesomeIcon icon={item.disabled ? faCircleCheck : faBan} />}
                        onClick={() => onChange(item.property, { ...item, disabled: !item.disabled })}
                    />
                </Tooltip>
            </div>
        </FormControl>
    );
}

export default FilterItem;