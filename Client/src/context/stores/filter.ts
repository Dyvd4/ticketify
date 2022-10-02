import { atom } from "jotai";
import { TFilterItem } from "src/components/List";
import { deleteUrlParam } from "src/utils/url";

export const filterItemsAtom = atom([] as TFilterItem[]);

export const filterItemsResetAtomWithUrl = atom(
    () => null,
    (get, set) => {
        const newFilterItems = get(filterItemsAtom);
        newFilterItems.forEach(filterItem => {
            filterItem.value = undefined;
        });
        set(filterItemsAtom, newFilterItems);
        deleteUrlParam("filter");
    }
)