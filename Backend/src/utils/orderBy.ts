import Object from "lodash"

export type OrderByQueryParam = {
    property: string
    direction: "desc" | "asc",
    disabled: boolean
}

export type OrderByQueryParams = Array<OrderByQueryParam>

export const mapOrderByQuery = (query) => {
    if (!query.orderBy) return {};
    const orderBys: OrderByQueryParams = JSON.parse((query.orderBy) as string);
    return orderBys
        .filter(orderBy => !orderBy.disabled)
        .map((orderBy) => {
            const orderByObj = {};
            Object.set(orderByObj, orderBy.property, orderBy.direction);
            return orderByObj;
        });
}