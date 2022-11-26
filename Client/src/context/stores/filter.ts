import { TFilterItem } from "components/List/Filter/FilterItems";
import { atom } from "jotai";

export const filterItemsAtom = atom([] as TFilterItem[]);