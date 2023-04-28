import { TSortItem } from "components/List/Sort/SortItems";
import { atom } from "jotai";

const sortItemsAtom = atom([] as TSortItem[]);
export default sortItemsAtom