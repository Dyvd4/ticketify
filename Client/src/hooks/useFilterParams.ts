import { useState } from "react";
import { DefaultFilterItemType } from "src/components/List/Filter/FilterItems";
// note: refac?
import { FilterOperationsType } from "src/components/List/Filter/Private/FilterOperations";

export const useFilterParams = (drawerRef: React.MutableRefObject<HTMLElement | null>) => {

    const [filterQueryParams, setFilterQueryParams] = useState<DefaultFilterItemType[] | null>(null);
    const [filterQueryParamsUrl, setFilterQueryParamsUrl] = useState<URL | null>(null);

    const getInputs = () => (Array.from(drawerRef.current!.querySelectorAll("input[id]")) as HTMLInputElement[]);
    const getOperations = () => (Array.from(drawerRef.current!.querySelectorAll('[name^="filter-operations"]')) as HTMLSelectElement[]);
    const getFilterItemProps = () => (Array.from(drawerRef.current!.querySelectorAll("[class^=filter-item-props")) as HTMLElement[])

    const getFilterParams = () => {
        const parseInputValue = (input, type: FilterOperationsType) => {
            switch (type) {
                case "number":
                    return parseInt(input.value)
                case "boolean":
                    return input.checked ? 1 : 0
                default:
                    return input.value
            }
        }
        const filterQueryParams: DefaultFilterItemType[] = getInputs()
            .map(input => {
                const operationsInput = getOperations()
                    .find(operation => operation.name.includes(input.id))
                if (!operationsInput) throw new Error(`No operation input found for input with name: ${input.name}`);
                const filterItemProps = Array.from(getFilterItemProps()
                    .find(filterItem => filterItem.className.includes(input.id))
                    ?.querySelectorAll("input") || [])
                    .reduce((map, propInput) => {
                        map[propInput.name] = propInput.value
                        return map;
                    }, {} as any);
                if (!filterItemProps) throw new Error(`No filter item props found for input with name: ${input.name}`);
                return {
                    type: filterItemProps.type,
                    property: filterItemProps.property,
                    value: parseInputValue(input, filterItemProps.type),
                    operation: {
                        value: operationsInput.value
                    },
                    disabled: input.disabled
                } as DefaultFilterItemType
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