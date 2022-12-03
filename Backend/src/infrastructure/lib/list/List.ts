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
    private query: Request["query"];
    protected itemsPerLoad: number

    constructor(query: Request["query"], prismaArgs: ListResultPrismaArgs, itemsPerLoad: number) {
        this.query = query;
        this.prismaArgs = prismaArgs;
        this.itemsPerLoad = itemsPerLoad;
    }

    getPrismaArgs = () => this.prismaArgs;

    getPrismaFilterArgs = () => expressPrismaFilterArgs(this.query);

    getPrismaOrderByArgs = () => expressPrismaFilterArgs(this.query);
}

export const expressPrismaFilterArgs = (query: Request["query"]) => prismaFilterArgs(query.filter as string)

const prismaFilterArgs = (stringifiedFilter: string) => {
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

    if (!stringifiedFilter) return {};
    const filter: FilterQueryParams = JSON.parse(stringifiedFilter);
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

export const expressPrismaOrderByArgs = (query: Request["query"]) => prismaOrderByArgs(query.orderBy as string)

const prismaOrderByArgs = (stringifiedOrderBy: string) => {
    const mappedOrderBy = (orderBy) => {
        const orderByObj = {};
        Object.set(orderByObj, orderBy.property, orderBy.direction.value);
        return orderByObj;
    }
    if (!stringifiedOrderBy) return {};
    const orderBy: OrderByQueryParams = JSON.parse(stringifiedOrderBy);
    if (orderBy.length) {
        return orderBy
            .filter(orderBy => !orderBy.disabled)
            .map(mappedOrderBy);
    }
    return [mappedOrderBy(orderBy)];
}