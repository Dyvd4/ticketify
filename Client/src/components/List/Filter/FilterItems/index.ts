import { FilterItemProps } from "./FilterItem";
import FilterItems from "./FilterItems";

export type TFilterItem = Omit<FilterItemProps, "onChange">;
export type TFilterOperations = "string" | "number" | "date" | "boolean";
export type TFilterOperation = {
	label: string;
	value: string;
};

export default FilterItems;
