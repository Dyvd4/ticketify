import FilterItems, { DefaultFilterItemType } from "src/components/List/Filter/FilterItems";
import { useUrlParams } from "src/hooks/useUrlParams";

function TicketListItemFilter() {
    const [filterItems, setFilterItems] = useUrlParams("filter", [
        {
            property: "isAmazing",
            type: "boolean",
            label: "Is amazing"
        },
        {
            property: "description",
            type: "string",
        },
        {
            property: "createdAt",
            type: "date",
            label: "created at"
        }
    ] as DefaultFilterItemType[],
        { jsonParse: true, dontSetUrl: true });

    return <FilterItems items={filterItems} onChange={items => setFilterItems(items)} />
}

export default TicketListItemFilter;