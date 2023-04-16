import { TSortItem } from "components/List/Sort/SortItems";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { sortDirections } from "src/components/List/Sort/data/directions";
import { useCurrentUserSettings } from "src/hooks/user";
import { getUrlParam } from "src/utils/url";
import { sortItemsAtom } from "../stores/sort";

const getDefaultDirection = () => sortDirections[0];

type UseSortItemsInitArgs = {
    defaultSortItems: TSortItem[],
    listId: string
}

const useSortItemsInit = ({ defaultSortItems, listId }: UseSortItemsInitArgs, onInit?: (sortItems) => void) => {

    const { currentUserSettings } = useCurrentUserSettings();
    const [, setSortItems] = useAtom(sortItemsAtom);

    useEffect(() => {
        if (!currentUserSettings) return;

        const {
            allowSortItemsByLocalStorage,
            allowSortItemsByUrl
        } = currentUserSettings;

        let sortItemsToSet: TSortItem[] = defaultSortItems;

        if (allowSortItemsByUrl) {
            let sortItemsFromUrl: any = getUrlParam(`orderBy-${listId}`);
            if (sortItemsFromUrl) sortItemsToSet = sortItemsFromUrl;
        }
        else if (allowSortItemsByLocalStorage) {
            let sortItemsFromLocalStorage = localStorage.getItem(`orderBy-${listId}`);
            if (sortItemsFromLocalStorage) sortItemsToSet = JSON.parse(sortItemsFromLocalStorage);
        }

        const sortItems = sortItemsToSet.map(sortItem => {
            return {
                direction: getDefaultDirection(),
                ...sortItem,
            }
        });

        setSortItems(sortItems as any);
        if (onInit) onInit(sortItems);

    }, [currentUserSettings]);

}

export default useSortItemsInit;