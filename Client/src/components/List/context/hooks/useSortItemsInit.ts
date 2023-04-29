import { TSortItem } from "components/List/Sort/SortItems";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { sortDirections } from "src/components/List/Sort/data/directions";
import { useCurrentUserSettings } from "src/hooks/user";
import { getUrlParam } from "src/utils/url";
import sortItemsAtom from "../atoms/sortItemsAtom";

const getDefaultDirection = () => sortDirections.get("ascending");

type UseSortItemsInitArgs = {
    defaultSortItems: TSortItem[],
    listId: string
}

const useSortItemsInit = (
    { defaultSortItems, listId }: UseSortItemsInitArgs,
    onInit?: (sortItems, fromLocalStorage: boolean, fromUrl: boolean) => void
) => {

    const { currentUserSettings } = useCurrentUserSettings();
    const [, setSortItems] = useAtom(sortItemsAtom);
    let sortItemsAreFromLocalStorage = false;
    let sortItemsAreFromUrl = false;

    useEffect(() => {
        if (!currentUserSettings) return;

        const {
            allowSortItemsByLocalStorage,
            allowSortItemsByUrl
        } = currentUserSettings;

        let sortItemsToSet: TSortItem[] = defaultSortItems;

        if (allowSortItemsByUrl) {
            let sortItemsFromUrl: any = getUrlParam(`orderBy-${listId}`);
            if (sortItemsFromUrl) {
                sortItemsToSet = sortItemsFromUrl;
                sortItemsAreFromUrl = true
            }
        }
        else if (allowSortItemsByLocalStorage) {
            let sortItemsFromLocalStorage = localStorage.getItem(`orderBy-${listId}`);
            if (sortItemsFromLocalStorage) {
                sortItemsToSet = JSON.parse(sortItemsFromLocalStorage);
                sortItemsAreFromLocalStorage = true;
            }
        }

        const sortItems = sortItemsToSet.map(sortItem => {
            return {
                direction: getDefaultDirection(),
                ...sortItem,
            }
        });

        setSortItems(sortItems as any);
        if (onInit) onInit(sortItems, sortItemsAreFromLocalStorage, sortItemsAreFromUrl);

    }, [currentUserSettings]);

}

export default useSortItemsInit;