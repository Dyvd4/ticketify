import Object from "lodash"

export type OrderByQueryParam = {
    property: string
    direction: "desc" | "asc",
    disabled: boolean
}

export type OrderByQueryParams = Array<OrderByQueryParam>

export const prismaOrderByArgs = (query) => {
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