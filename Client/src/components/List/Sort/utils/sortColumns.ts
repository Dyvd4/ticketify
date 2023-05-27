import { sortDirections } from "../data/directions";
import { TSortItem } from "../SortItems";

const orderByDirectionActiveMap = new Map<string, { asc: boolean; desc: boolean }>();

/** toggles the column's `direction` and `disabled` property */
export const getToggledColumn = (column: TSortItem): TSortItem => {
    const activeMap = orderByDirectionActiveMap.get(column.property)!;

    if (column.disabled) {
        column.disabled = false;
    }

    if (activeMap.asc && activeMap.desc) {
        column.disabled = true;
        activeMap.asc = false;
        activeMap.desc = false;
    }

    if (!column.disabled && column.direction!.value === "asc") {
        activeMap.desc = true;
        column.direction = sortDirections.get("descending");
    } else if (!column.disabled && column.direction!.value === "desc") {
        activeMap.asc = true;
        column.direction = sortDirections.get("ascending");
    }

    orderByDirectionActiveMap.set(column.property, activeMap);
    return column;
};

/** initializes a map for looking up which sort direction has been active before
 * in order to set the disabled state properly
 *
 * only used internally in the `getToggledColumn`-fn
 */
export const initOrderByDirectionActiveMap = (columns: TSortItem[]) => {
    columns.forEach((column) =>
        orderByDirectionActiveMap.set(column.property, {
            asc: column.direction?.value === "asc" && !column.disabled,
            desc: column.direction?.value === "desc" && !column.disabled,
        })
    );
    return orderByDirectionActiveMap;
};
