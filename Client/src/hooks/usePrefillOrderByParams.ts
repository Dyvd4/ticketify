import { OrderByQueryParam } from "./useOrderByParams";

export const usePrefillOrderByParams = (drawerRef: React.MutableRefObject<HTMLElement | null>) => {

    const getInputs = () => Array.from(drawerRef.current!.querySelectorAll("input"));
    const getDirections = () => (Array.from(drawerRef.current!.querySelectorAll('[name^="sort-directions"]')) as HTMLSelectElement[]);

    const prefillOrderByParams = () => {
        const orderByParams = new URLSearchParams(window.location.search).get("orderBy");
        if (!orderByParams) return;
        const inputs = getInputs();
        const directions = getDirections();
        (JSON.parse(orderByParams) as OrderByQueryParam[]).forEach(queryParam => {
            const input = inputs.find(input => input.name === queryParam.property);
            if (!input) throw new Error(`No input found for queryParam property: ${queryParam.property}`);
            const direction = directions.find(direction => direction.name.includes(queryParam.property))
            if (!direction) throw new Error(`No direction input found for queryParam property: ${queryParam.property}`);
            direction.value = queryParam.direction;
        })
    }

    return { prefillOrderByParams };
}