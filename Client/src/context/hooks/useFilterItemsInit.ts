import { useAtom } from "jotai";
import { useEffect } from "react";
import { TFilterItem } from "src/components/List";
import { getUrlParam } from "src/utils/url";
import { filterItemsAtom } from "../stores/filter";
// import * from operationsData??? 🤔
import { operationsData } from "src/components/List";

const getDefaultOperation = (filterItem: TFilterItem) => operationsData.typeOperations[filterItem.type][0];

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