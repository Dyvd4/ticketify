import { useAtom } from "jotai";
import { useEffect } from "react";
import { typeOperations } from "src/components/List/Filter/data/operations";
import { TFilterItem } from "src/components/List/Filter/FilterItems";
import { useCurrentUserSettings } from "src/hooks/user";
import { getUrlParam } from "src/utils/url";
import { filterItemsAtom } from "../stores/filter";

const getDefaultOperation = (filterItem: TFilterItem) => typeOperations[filterItem.type][0];

type UseFilterItemsInitArgs = {
    defaultFilterItems: TFilterItem[],
    listId: string
}

const useFilterItemsInit = ({ defaultFilterItems, listId }: UseFilterItemsInitArgs, onInit?: (filterItems) => void) => {

    const { currentUserSettings } = useCurrentUserSettings();
    const [, setFilterItems] = useAtom(filterItemsAtom);

    useEffect(() => {

        if (!currentUserSettings) return;

        const {
            allowFilterItemsByLocalStorage,
            allowFilterItemsByUrl,
        } = currentUserSettings;

        let filterItemsToSet: TFilterItem[] = defaultFilterItems;

        if (allowFilterItemsByUrl) {
            let filterItemsFromUrl: any = getUrlParam(`filter-${listId}`);
            if (filterItemsFromUrl) filterItemsToSet = filterItemsFromUrl;
        }
        else if (allowFilterItemsByLocalStorage) {
            let filterItemsFromLocalStorage = localStorage.getItem(`filter-${listId}`);
            if (filterItemsFromLocalStorage) filterItemsToSet = JSON.parse(filterItemsFromLocalStorage);
        }

        const filterItems = filterItemsToSet.map(filterItem => {
            return {
                ...filterItem,
                // 🤔
                operation: getDefaultOperation(filterItem)
            }
        });

        setFilterItems(filterItems);
        if (onInit) onInit(filterItems);

    }, [currentUserSettings]);

}

export default useFilterItemsInit;