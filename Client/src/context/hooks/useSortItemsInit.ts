import { useAtom } from "jotai";
import { useEffect } from "react";
import { sortDirections } from "src/components/List/Sort/data/directions";
import { sortItemsAtom } from "../stores/sort";
import { TSortItem } from "components/List/Sort/SortItems";
import { getUrlParam } from "src/utils/url";

const getDefaultDirection = () => sortDirections[0];

const useSortItemsInit = (defaultSortItems: TSortItem[], onInit?: (sortItems) => void) => {

    const [, setSortItems] = useAtom(sortItemsAtom);

    useEffect(() => {
        let sortItem: any = getUrlParam("orderBy");
        if (sortItem) sortItem = JSON.parse(sortItem);
        const sortItems = sortItem || defaultSortItems.map(sortItem => {
            return {
                ...sortItem,
                direction: getDefaultDirection()
            }
        });
        setSortItems(sortItems);
        if (onInit) onInit(sortItems);
    }, []);

}

export default useSortItemsInit;