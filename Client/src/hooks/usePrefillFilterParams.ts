import { FilterQueryParam } from "./useFilterParams";

export const usePrefillFilterParams = (drawerRef: React.MutableRefObject<HTMLElement | null>) => {

    const getInputs = () => Array.from(drawerRef.current!.querySelectorAll("input"));
    const getOperations = () => (Array.from(drawerRef.current!.querySelectorAll('[name^="filter-operations"]')) as HTMLSelectElement[]);

    const prefillFilterParams = () => {
        const filterParams = new URLSearchParams(window.location.search).get("filter");
        if (!filterParams) return;
        const inputs = getInputs();
        const operations = getOperations();
        (JSON.parse(filterParams) as FilterQueryParam[]).forEach(queryParam => {
            const input = inputs.find(input => input.name === queryParam.property);
            if (!input) throw new Error(`No input found for queryParam property: ${queryParam.property}`);
            const operation = operations.find(operation => operation.name.includes(queryParam.property))
            if (!operation) throw new Error(`No operation input found for queryParam property: ${queryParam.property}`);
            input.value = queryParam.value;
            operation.value = queryParam.operation;
        })
    }

    return { prefillFilterParams };
}