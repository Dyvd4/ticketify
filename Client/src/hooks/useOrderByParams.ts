import { useState } from "react";
import { SortItemType } from "src/components/List/Sort/Private/SortItem";

export const useOrderByParams = (drawerRef: React.MutableRefObject<HTMLElement | null>) => {
    const [orderByQueryParams, setOrderByQueryParams] = useState<SortItemType[] | null>(null);
    const [orderByQueryParamsUrl, setOrderByQueryParamsUrl] = useState<URL | null>(null);

    const getInputs = () => (Array.from(drawerRef.current!.querySelectorAll("input[id]")) as HTMLInputElement[])
    const getDirections = () => (Array.from(drawerRef.current!.querySelectorAll('[name^="sort-directions"]')) as HTMLSelectElement[])

    const getOrderByParams = () => {
        const orderByParams: SortItemType[] = getInputs()
            .map(input => {
                const directionsInput = getDirections()
                    .find(operation => operation.name.includes(input.id))
                if (!directionsInput) throw new Error(`No direction input found for input with name: ${input.name}`);
                return {
                    property: input.name,
                    label: input.value,
                    direction: directionsInput.value,
                    disabled: input.disabled
                } as SortItemType
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