import { DefaultFilterItemType } from "src/components/List/Filter/FilterItems";
import SortItems from "src/components/List/Sort/SortItems";
import { useUrlParams } from "src/hooks/useUrlParams";

function TicketListItemSort() {
    const [sortItems, setSortItems] = useUrlParams("orderBy", true, [
        {
            property: "title"
        },
        {
            property: "dueDate"
        }
    ] as DefaultFilterItemType[]);
    return <SortItems items={sortItems} onChange={(items) => { setSortItems(items) }} />
}

export default TicketListItemSort;