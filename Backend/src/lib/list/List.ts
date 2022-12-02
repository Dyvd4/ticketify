import Object from "lodash"
import { Request } from "express";
import { ListResultPrismaArgs } from ".";

type FilterItemProps = {
    type: FilterOperationsType
    property: string
    value?: string
    operation?: Omit<FilterOperation, "label">
    disabled?: boolean
}
type FilterOperationsType = "string" | "number" | "date" | "boolean"
type FilterOperation = {
    label: string
    value: string
}
type FilterQueryParams = Array<FilterItemProps>
type OrderByQueryParam = {
    property: string
    direction: "desc" | "asc",
    disabled: boolean
}
type OrderByQueryParams = Array<OrderByQueryParam>

export default class List {

    protected prismaArgs: ListResultPrismaArgs;
    protected itemsPerLoad: number

    constructor(prismaArgs: ListResultPrismaArgs, itemsPerLoad: number) {
        this.prismaArgs = prismaArgs;
        this.itemsPerLoad = itemsPerLoad;
    }

    getPrismaArgs = () => this.prismaArgs;

    getPrismaFilterArgs = prismaFilterArgs

    getPrismaOrderByArgs = prismaOrderByArgs
}

export const prismaFilterArgs = (query: Request["query"]) => {

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

export const prismaOrderByArgs = (query: Request["query"]) => {
    const mappedOrderBy = (orderBy) => {
        const orderByObj = {};
        Object.set(orderByObj, orderBy.property, orderBy.direction.value);
        return orderByObj;
    }
    if (!query.orderBy) return {};
    const orderBy: OrderByQueryParams = JSON.parse((query.orderBy) as string);
    if (orderBy.length) {
        return orderBy
            .filter(orderBy => !orderBy.disabled)
            .map(mappedOrderBy);
    }
    return [mappedOrderBy(orderBy)];
}