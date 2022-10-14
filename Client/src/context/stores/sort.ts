import { atom } from "jotai";
import { TSortItem } from "components/List/Sort/SortItems";
import { deleteUrlParam } from "src/utils/url";

export const sortItemsAtom = atom([] as TSortItem[]);

export const sortItemsResetAtomWithUrl = atom(
    () => null,
    (get, set) => {
        const newFilterItems = get(sortItemsAtom);
        set(sortItemsAtom, newFilterItems);
        deleteUrlParam("orderBy");
    }
)