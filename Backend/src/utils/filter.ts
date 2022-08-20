import Object from "lodash"

export type FilterItemProps = {
    type: FilterOperationsType
    property: string
    value?: string
    operation?: Omit<FilterOperation, "label">
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
    return filter.reduce((map, filter) => {
        Object.set(map, `AND.${filter.property}.${filter.operation?.value}`, parseFilterValue(filter.value, filter.type));
        return map;
    }, {})
}

const parseFilterValue = (value, type: FilterOperationsType) => {
    switch (type) {
        case "number":
            return parseInt(value)
        case "boolean":
            return Boolean(parseInt(value))
        default:
            return value
    }
}