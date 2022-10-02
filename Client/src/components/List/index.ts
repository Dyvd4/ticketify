import { FilterItemProps } from "./Private/Filter/FilterItem";
import FilterItems from "./Private/Filter/FilterItems";
import { SortItemProps } from "./Private/Sort/SortItem";
import SortItems from "./Private/Sort/SortItems";
import * as directionsData from "./Private/Sort/data/directions";
import * as operationsData from "./Private/Filter/data/operations";

export type TFilterItem = Omit<FilterItemProps, "onChange">;
export type TFilterOperations = "string" | "number" | "date" | "boolean"
export type TFilterOperation = {
    label: string
    value: string
}
export type TSortDirection = {
    label: string
    value: "asc" | "desc"
}
export type TSortItem = Omit<SortItemProps, "onChange" | "onSortUp" | "onSortDown">;
export type TDrawer = "filter" | "orderBy"

export { SortItems, directionsData, FilterItems, operationsData }