import { useState } from "react"

type OrderByDirection = "desc" | "asc";

export type OrderByQueryParam = {
    property: string
    direction: OrderByDirection
}

export const useOrderByParams = (drawerRef: React.MutableRefObject<HTMLElement | null>) => {
    const [orderByQueryParams, setOrderByQueryParams] = useState<OrderByQueryParam[] | null>(null);
    const [orderByQueryParamsUrl, setOrderByQueryParamsUrl] = useState<URL | null>(null);

    const getInputs = () => Array.from(drawerRef.current!.querySelectorAll("input"))
    const getDirections = () => (Array.from(drawerRef.current!.querySelectorAll('[name^="sort-directions"]')) as HTMLSelectElement[])

    const getOrderByParams = () => {
        const orderByParams: OrderByQueryParam[] = getInputs()
            .map(input => {
                const directionsInput = getDirections()
                    .find(operation => operation.getAttribute("name")?.includes(input.name))
                if (!directionsInput) throw new Error(`No direction input found for input with name: ${input.name}`);
                return {
                    property: input.name,
                    label: input.value,
                    direction: directionsInput.value as OrderByDirection,
                    disabled: input.disabled
                }
            });
        return orderByParams;
    }
    const getOrderByParamsUrl = () => {
        const url = new URL(window.location.href)
        const orderByParams = getOrderByParams();
        if (orderByParams.length > 0) url.searchParams.set("orderBy", JSON.stringify(orderByParams));
        return url;
    }
    const setOrderByParams = () => {
        setOrderByQueryParams(getOrderByParams());
    }
    const setOrderByParamsUrl = () => {
        const url = getOrderByParamsUrl();
        window.history.pushState(null, "", url);
        setOrderByQueryParamsUrl(url);
    }
    const resetOrderByParams = () => {
        setOrderByQueryParams(null)
    }
    const resetOrderByParamsUrl = () => {
        const url = new URL(window.location.href)
        url.searchParams.delete("orderBy");
        window.history.pushState(null, "", url);
        setOrderByQueryParamsUrl(null);
    }
    return {
        orderByParams: orderByQueryParams,
        orderByParamsUrl: orderByQueryParamsUrl,
        setOrderByParams,
        setOrderByParamsUrl,
        resetOrderByParams,
        resetOrderByParamsUrl
    }
}