import { CircularProgress } from "@chakra-ui/react";
import FilterItem, { FilterItemType } from "./Private/FilterItem";

export type DefaultFilterItemType = Omit<FilterItemType, "value" | "operation" | "onChange">;

type FilterItemsProps = {
    items: FilterItemType[]
    onChange(...args)
}

function FilterItems({ items, onChange }: FilterItemsProps) {
    const handleChange = (name, changedItem) => {
        const itemToChange = items.find(item => item.property === name)!
        const spliceIndex = items.indexOf(itemToChange);
        items.splice(spliceIndex, 1, changedItem);
        onChange([...items]);
    }
    return items
        ? <div className="flex flex-col gap-2">
            {items.map((item, index, self) => (
                <FilterItem {...item}
                    onChange={handleChange}
                    key={item.property}
                />
            ))}
        </div>
        : <CircularProgress isIndeterminate />
}

export default FilterItems;