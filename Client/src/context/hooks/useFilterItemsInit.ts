import { useAtom } from "jotai";
import { useEffect } from "react";
import { typeOperations } from "src/components/List/Filter/data/operations";
import { TFilterItem } from "src/components/List/Filter/FilterItems";
import { getUrlParam } from "src/utils/url";
import { filterItemsAtom } from "../stores/filter";

const getDefaultOperation = (filterItem: TFilterItem) => typeOperations[filterItem.type][0];

const useFilterItemsInit = (defaultFilterItems: TFilterItem[], onInit?: (filterItems) => void) => {

    const [, setFilterItems] = useAtom(filterItemsAtom);

    useEffect(() => {
        let filterParam: any = getUrlParam("filter");
        if (filterParam) filterParam = JSON.parse(filterParam);
        const filterItems = filterParam || defaultFilterItems.map(filterItem => {
            return {
                ...filterItem,
                // 🤔
                operation: getDefaultOperation(filterItem)
            }
        });
        setFilterItems(filterItems);
        if (onInit) onInit(filterItems);
    }, []);

}

export default useFilterItemsInit;