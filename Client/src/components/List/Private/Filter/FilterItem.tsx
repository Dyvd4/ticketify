import { FormControl, FormLabel, IconButton, Tooltip } from "@chakra-ui/react";
import { faBan, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TFilterOperation, TFilterOperations } from "../../";
import FilterInput from "./FilterInput";
import FilterOperations from "./FilterOperations";

export type FilterItemProps = {
    onChange(property: string, changedItem: any)
    label?: string
    property: string
    type: TFilterOperations
    value?: string
    operation?: TFilterOperation
    disabled?: boolean
}

function FilterItem({ onChange, ...item }: FilterItemProps) {
    return (
        <FormControl>
            <FormLabel>{item.label || item.property}</FormLabel>
            <div className="flex items-center gap-2">
                <FilterInput
                    onChange={(value) => onChange(item.property, {
                        ...item,
                        value
                    })}
                    name={item.property}
                    value={item.value}
                    type={item.type}
                    disabled={item.disabled}
                />
                <FilterOperations
                    onChange={(value) => onChange(item.property, {
                        ...item,
                        operation: {
                            ...item.operation,
                            value
                        }
                    })}
                    operation={item.operation}
                    type={item.type}
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