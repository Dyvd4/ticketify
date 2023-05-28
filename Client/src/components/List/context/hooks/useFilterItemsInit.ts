import { useAtom } from "jotai";
import { useEffect } from "react";
import { typeOperations } from "src/components/List/Filter/data/operations";
import { TFilterItem } from "src/components/List/Filter/FilterItems";
import { useCurrentUserSettings } from "src/hooks/user";
import { getUrlParam } from "src/utils/url";
import { e } from "vitest/dist/index-9f5bc072";
import filterItemsAtom from "../atoms/filterItemsAtom";

const getDefaultOperation = (filterItem: TFilterItem) => typeOperations[filterItem.type][0];

type UseFilterItemsInitArgs = {
	defaultFilterItems: TFilterItem[];
	listId: string;
};

const useFilterItemsInit = (
	{ defaultFilterItems, listId }: UseFilterItemsInitArgs,
	onInit?: (filterItems, fromLocalStorage: boolean, fromUrl: boolean) => void
) => {
	const { currentUserSettings } = useCurrentUserSettings();
	const [, setFilterItems] = useAtom(filterItemsAtom);
	let filterItemsAreFromLocalStorage = false;
	let filterItemsAreFromUrl = false;

	useEffect(() => {
		if (!currentUserSettings) return;

		const { allowFilterItemsByLocalStorage, allowFilterItemsByUrl } = currentUserSettings;

		let filterItemsToSet: TFilterItem[] = defaultFilterItems;

		if (allowFilterItemsByUrl) {
			let filterItemsFromUrl: any = getUrlParam(`filter-${listId}`);
			if (filterItemsFromUrl) {
				filterItemsToSet = filterItemsFromUrl;
				filterItemsAreFromUrl = true;
			}
		} else if (allowFilterItemsByLocalStorage) {
			let filterItemsFromLocalStorage = localStorage.getItem(`filter-${listId}`);
			if (filterItemsFromLocalStorage) {
				filterItemsToSet = JSON.parse(filterItemsFromLocalStorage);
				filterItemsAreFromLocalStorage = true;
			}
		}

		const filterItems = filterItemsToSet.map((filterItem) => {
			if (!filterItem.operation) {
				return {
					...filterItem,
					operation: getDefaultOperation(filterItem),
				};
			} else {
				return filterItem;
			}
		});

		setFilterItems(filterItems);
		if (onInit) onInit(filterItems, filterItemsAreFromLocalStorage, filterItemsAreFromUrl);
	}, [currentUserSettings]);
};

export default useFilterItemsInit;
