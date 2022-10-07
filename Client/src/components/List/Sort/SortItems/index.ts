import { SortItemProps } from "./SortItem";
import SortItems from "./SortItems";

export type TSortDirection = {
    label: string
    value: "asc" | "desc"
}
export type TSortItem = Omit<SortItemProps, "onChange" | "onSortUp" | "onSortDown">;

export default SortItems;