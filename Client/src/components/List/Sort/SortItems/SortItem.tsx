import { IconButton, Input, Tooltip } from "@chakra-ui/react";
import { faBan, faCircleCheck, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TSortDirection } from ".";
import SortDirections from "./SortDirections";

export type SortItemProps = {
    property: string;
    label?: string;
    disabled?: boolean;
    direction?: TSortDirection;
    onChange(property: string, changedItem: any);
    onSortUp?(...args);
    onSortDown?(...args);
};

function SortItem({ onChange, onSortUp, onSortDown, ...item }: SortItemProps) {
    return (
        <div className="flex items-center gap-2">
            <Input
                disabled={item.disabled}
                readOnly
                name={item.property}
                type="text"
                value={item.label || item.property}
                onChange={(e) => onChange(item.property, { ...item, value: e.target.value })}
            />
            <SortDirections
                disabled={item.disabled}
                onSelect={(value) => {
                    onChange(item.property, {
                        ...item,
                        direction: {
                            ...item.direction,
                            value,
                        },
                    });
                }}
                direction={item.direction}
            />
            <Tooltip label="move up" placement="top">
                <IconButton
                    disabled={!onSortUp || item.disabled}
                    size="xs"
                    aria-label="sort-up"
                    icon={<FontAwesomeIcon icon={faSortUp} />}
                    onClick={() => onSortUp && onSortUp(item.property)}
                />
            </Tooltip>
            <Tooltip label="move down" placement="top">
                <IconButton
                    disabled={!onSortDown || item.disabled}
                    size="xs"
                    aria-label="sort-down"
                    icon={<FontAwesomeIcon icon={faSortDown} />}
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
