import { IconButton, Input, Tooltip } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCircleCheck, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import SortDirections from "./SortDirections";
import { useId } from "react";

export type SortItemType = Omit<SortItemProps, "onChange" | "onSortUp" | "onSortDown">

export type SortItemProps = {
    /** the name of the property to order by */
    property: string
    /** the value that will be displayed
     * (doesn't affect orderBy in any way)
     */
    label?: string
    disabled?: boolean
    direction?: "asc" | "desc"
    onChange(...args)
    onSortUp?(...args)
    onSortDown?(...args)
}

function SortItem({ onChange, onSortUp, onSortDown, ...item }: SortItemProps) {
    const inputId = useId();
    return (
        <div className="flex items-center gap-2">
            <Input
                disabled={item.disabled}
                readOnly
                name={item.property}
                type="text"
                value={item.label || item.property}
                id={inputId}
            />
            <SortDirections
                disabled={item.disabled}
                onSelect={(direction) => onChange(item.property, { ...item, direction })}
                for={inputId}
                direction={item.direction}
            />
            <Tooltip label="move up" placement="top">
                <IconButton
                    disabled={!onSortUp || item.disabled}
                    size="xs"
                    aria-label="sort-up"
                    icon={<FontAwesomeIcon
                        icon={faSortUp} />}
                    onClick={() => onSortUp && onSortUp(item.property)}
                />
            </Tooltip>
            <Tooltip label="move down" placement="top">
                <IconButton
                    disabled={!onSortDown || item.disabled}
                    size="xs"
                    aria-label="sort-down"
                    icon={<FontAwesomeIcon
                        icon={faSortDown} />}
                    onClick={() => onSortDown && onSortDown(item.property)}
                />
            </Tooltip>
            <Tooltip label={item.disabled ? "enable" : "disable"} placement="top">
                <IconButton
                    size="xs"
                    aria-label="disable"
                    icon={<FontAwesomeIcon icon={item.disabled ? faCircleCheck : faBan} />}
                    onClick={() => onChange(item.property, { ...item, disabled: !item.disabled })}
                />
            </Tooltip>
        </div>
    );
}

export default SortItem;