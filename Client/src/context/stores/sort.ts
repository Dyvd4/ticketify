import { TSortItem } from "components/List/Sort/SortItems";
import { atom } from "jotai";

export const sortItemsAtom = atom([] as TSortItem[]);