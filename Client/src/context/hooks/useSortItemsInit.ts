import { useAtom } from "jotai";
import { useEffect } from "react";
import { TSortItem } from "src/components/List";
import { getUrlParam } from "src/utils/url";
// import * from directionsData??? 🤔
import { directionsData } from "src/components/List";
import { sortItemsAtom } from "../stores/sort";

const getDefaultDirection = () => directionsData.sortDirections[0];

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