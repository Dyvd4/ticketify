import Object from "lodash"

export type FilterItemProps = {
    type: FilterOperationsType
    property: string
    value?: string
    operation?: Omit<FilterOperation, "label">
    disabled?: boolean
}
export type FilterOperationsType = "string" | "number" | "date" | "boolean"
export type FilterOperation = {
    label: string
    value: string
}
export type FilterQueryParams = Array<FilterItemProps>

export const mapFilterQuery = (query) => {
    if (!query.filter) return {};
    const filter: FilterQueryParams = JSON.parse((query.filter) as string);
    const mappedFilter = filter
        .filter(filter => !filter.disabled)
        .reduce((map, filter) => {
            if (filter.value !== null && filter.value !== "") {
                Object.set(map, `AND.${filter.property}.${filter.operation?.value}`, parseFilterValue(filter.value, filter.type));
            }
            return map;
        }, {})
    return mappedFilter;
}

const parseFilterValue = (value, type: FilterOperationsType) => {
    switch (type) {
        case "boolean":
            return Boolean(value)
        case "date":
            return value
                ? new Date(value)
                : undefined
        default:
            return value
    }
}