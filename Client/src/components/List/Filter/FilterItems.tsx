import FilterItem, { FilterItemType } from "./Private/FilterItem";

export type DefaultFilterItemType = Omit<FilterItemType, "value" | "operation">;

type FilterItemsProps = {
    items: FilterItemType[]
}

function FilterItems({ items }: FilterItemsProps) {
    return <div className="flex flex-col gap-2">
        {items.map((item, index, self) => (
            <FilterItem {...item}
                key={item.property}
            />
        ))}
    </div>
}

export default FilterItems;