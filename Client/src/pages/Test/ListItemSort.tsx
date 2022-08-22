import SortItems, { DefaultSortItemType } from "src/components/List/Sort/SortItems";
import { useUrlParams } from "src/hooks/useUrlParams";

function TicketListItemSort() {
    const [sortItems, setSortItems] = useUrlParams("orderBy", [
        {
            property: "isAmazing",
            label: "Is amazing"
        },
        {
            property: "description",
        },
        {
            property: "createdAt",
            label: "created at"
        }
    ] as DefaultSortItemType[],
        { jsonParse: true, dontSetUrl: true });
    return <SortItems items={sortItems} onChange={(items) => { setSortItems(items) }} />
}

export default TicketListItemSort;