import { useState } from "react"

type FilterOperation = "contains" | "equals" | "gt" | "lt"

export type FilterQueryParam = {
    property: string,
    operation: FilterOperation
    value: any
}

export const useFilterParams = (drawerRef: React.MutableRefObject<HTMLElement | null>) => {

    const [filterQueryParams, setFilterQueryParams] = useState<FilterQueryParam[] | null>(null);
    const [filterQueryParamsUrl, setFilterQueryParamsUrl] = useState<URL | null>(null);

    const getInputs = () => Array.from(drawerRef.current!.querySelectorAll("input"));
    const getOperations = () => (Array.from(drawerRef.current!.querySelectorAll('[name^="filter-operations"]')) as HTMLSelectElement[]);

    const getFilterParams = () => {
        const filterQueryParams: FilterQueryParam[] = getInputs()
            .map(input => {
                const operationsInput = getOperations()
                    .find(operation => operation.name.includes(input.name))
                if (!operationsInput) throw new Error(`No operation input found for input with name: ${input.name}`);
                return {
                    property: input.name,
                    value: input.value,
                    operation: operationsInput.value as FilterOperation
                }
            });
        return filterQueryParams;
    }
    const getFilterParamsUrl = () => {
        const url = new URL(window.location.href)
        const filterParams = getFilterParams();
        if (filterParams.length > 0) url.searchParams.set("filter", JSON.stringify(filterParams));
        return url;
    }
    const setFilterParams = () => {
        setFilterQueryParams(getFilterParams());
    }
    const setFilterParamsUrl = () => {
        const url = getFilterParamsUrl();
        window.history.pushState(null, "", url);
        setFilterQueryParamsUrl(url);
    }
    const resetFilterParams = () => {
        setFilterQueryParams(null)
    }
    const resetFilterParamsUrl = () => {
        const url = new URL(window.location.href)
        url.searchParams.delete("filter");
        window.history.pushState(null, "", url);
        setFilterQueryParamsUrl(null);
    }
    return {
        filterParams: filterQueryParams,
        filterParamsUrl: filterQueryParamsUrl,
        setFilterParams,
        setFilterParamsUrl,
        resetFilterParams,
        resetFilterParamsUrl
    }
}