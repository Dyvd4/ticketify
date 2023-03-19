import Object from "lodash";
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
    private stringifiedPrismaFilter: string;
    private stringifiedPrismOrderBy: string
    protected itemsPerLoad: number

    constructor(prismaFilter: string, prismaOrderBy: string, prismaArgs: ListResultPrismaArgs, itemsPerLoad: number) {
        this.stringifiedPrismaFilter = prismaFilter;
        this.stringifiedPrismOrderBy = prismaOrderBy;
        this.prismaArgs = prismaArgs;
        this.itemsPerLoad = itemsPerLoad;
    }

    getPrismaArgs = () => this.prismaArgs;

    getPrismaFilterArgs = () => getParsedPrismaFilterArgs(this.stringifiedPrismaFilter);

    getPrismaOrderByArgs = () => getParsedPrismaOrderByArgs(this.stringifiedPrismOrderBy);
}

export const getParsedPrismaFilterArgs = (stringifiedFilter: string) => {
    const getParsesFilterValue = (value, type: FilterOperationsType) => {
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

    const filter: FilterQueryParams = JSON.parse(stringifiedFilter);
    const mappedFilter = filter
        .filter(filter => !filter.disabled)
        .reduce((map, filter) => {
            if (filter.value !== null && filter.value !== "") {
                Object.set(map, `AND.${filter.property}.${filter.operation?.value}`, getParsesFilterValue(filter.value, filter.type));
            }
            return map;
        }, {})
    return mappedFilter;
}

export const getParsedPrismaOrderByArgs = (stringifiedOrderBy: string) => {
    const mappedOrderBy = (orderBy) => {
        const orderByObj = {};
        Object.set(orderByObj, orderBy.property, orderBy.direction.value);
        return orderByObj;
    }
	
    const orderBy: OrderByQueryParams = JSON.parse(stringifiedOrderBy);
    if (orderBy.length) {
        return orderBy
            .filter(orderBy => !orderBy.disabled)
            .map(mappedOrderBy);
    }
    return [mappedOrderBy(orderBy)];
}