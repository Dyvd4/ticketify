import FilterItems, { DefaultFilterItemType } from "src/components/List/Filter/FilterItems";
import { useUrlParams } from "src/hooks/useUrlParams";

function TicketListItemFilter() {
    const [filterItems, setFilterItems] = useUrlParams("filter", [
        {
            property: "title",
            label: "Title",
            type: "string"
        }
    ] as DefaultFilterItemType[],
        { jsonParse: true, dontSetUrl: true });

    return <FilterItems items={filterItems} onChange={items => setFilterItems(items)}
    />
}

export default TicketListItemFilter;