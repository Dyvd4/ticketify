import { TFilterItem } from "components/List/Filter/FilterItems";
import { atom } from "jotai";

const filterItemsAtom = atom([] as TFilterItem[]);
export default filterItemsAtom;