import { useState } from "react";
import { SortItemType } from "src/components/List/Sort/Private/SortItem";
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
    ]);
    return <SortItems items={sortItems} onChange={(items) => { setSortItems(items) }} />
}

export default TicketListItemSort;