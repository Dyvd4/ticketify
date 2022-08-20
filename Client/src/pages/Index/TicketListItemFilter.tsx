import FilterItems, { DefaultFilterItemType } from "src/components/List/Filter/FilterItems";
import { useUrlParams } from "src/hooks/useUrlParams";

function TicketListItemFilter() {
    const [filterItems, setFilterItems] = useUrlParams("filter", true, [
        {
            property: "title",
            label: "Title",
            type: "string"
        }
    ] as DefaultFilterItemType[]);

    return <FilterItems items={filterItems} onChange={items => setFilterItems(items)}
    />
}

export default TicketListItemFilter;