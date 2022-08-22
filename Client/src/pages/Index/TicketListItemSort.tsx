import SortItems, { DefaultSortItemType } from "src/components/List/Sort/SortItems";
import { useUrlParams } from "src/hooks/useUrlParams";

function TicketListItemSort() {
    const [sortItems, setSortItems] = useUrlParams("orderBy", [
        {
            property: "title"
        },
        {
            property: "dueDate"
        }
    ] as DefaultSortItemType[],
        { jsonParse: true, dontSetUrl: true });
    return <SortItems items={sortItems} onChange={(items) => { setSortItems(items) }} />
}

export default TicketListItemSort;