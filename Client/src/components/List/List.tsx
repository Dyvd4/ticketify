import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import filterItemsAtom from "src/components/List/context/atoms/filterItemsAtom";
import searchItemAtom from "src/components/List/context/atoms/searchItemAtom";
import sortItemsAtom from "src/components/List/context/atoms/sortItemsAtom";
import useFilterItemsInit from "src/components/List/context/hooks/useFilterItemsInit";
import useSearchItemInit from "src/components/List/context/hooks/useSearchItemInit";
import useSortItemsInit from "src/components/List/context/hooks/useSortItemsInit";
import { useInfiniteQuery, useInfiniteQueryCount, useQuery } from "src/hooks/query";
import useDebounce from "src/hooks/useDebounce";
import { useCurrentUserSettings } from "src/hooks/user";
import { useUrlParams } from "src/hooks/useUrlParams";
import { deleteUrlParam, setUrlParam } from "src/utils/url";
import { TDrawer, TSearchItem } from ".";
import { ITEMS_PER_PAGE_STEPS } from "../Pager/PagerSection";
import { TFilterItem } from "./Filter/FilterItems";
import ListBody from "./ListBody";
import ListHeader from "./ListHeader";
import { InfiniteLoaderResult } from "./Result/InfiniteLoaderResultItems";
import { ListResultVariant } from "./Result/ListResultItems";
import { PagerResult } from "./Result/PagerResultItems";
import SortDrawer from "./Sort/SortDrawer";
import SortItems, { TSortItem } from "./Sort/SortItems";

type ListProps = {
    fetch: {
        /** used for react-query */
        queryKey: string
        /** the url path to fetch the entity from */
        route: string
    }
    listItemRender(listItem): React.ReactElement
    loadingDisplay?: JSX.Element
    header?: {
        title?: string
        showCount?: boolean
    }
    /**
     * - unique `id` for the list
     * - the `id` is used to create a relation between the filter and sort items in the local storage and the list
     */
    id: string
    sort: TSortItem[]
    filter: TFilterItem[]
    search?: TSearchItem
    onAdd?(...args: any[]): void
    variant: ListResultVariant
}

function List(props: ListProps) {

    const {
        listItemRender,
        fetch: { queryKey, route },
        header,
        variant
    } = props;

    const drawerRef = useRef<HTMLDivElement | null>(null);

    // sort, filter, page state 
    // ------------------------
    const [filterItems, setFilterItems] = useAtom(filterItemsAtom);
    const [sortItems, setSortItems] = useAtom(sortItemsAtom);
    const [searchItem] = useAtom(searchItemAtom);
    const { value: debouncedSearchItem } = useDebounce(searchItem)
    const [queryParams, setQueryParams] = useState<any>({});
    const [page, setPage] = useUrlParams("page", 1);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_STEPS[0] as number);

    // hooks
    // -----
    const { currentUserSettings } = useCurrentUserSettings();

    useFilterItemsInit({
        defaultFilterItems: props.filter,
        listId: props.id
    }, (filterItems, fromLocalStorage, fromUrl) => {
        if (!fromLocalStorage && !fromUrl) return;
        setQueryParams(params => {
            return {
                ...params,
                filter: filterItems
            }
        });
    });

    useSortItemsInit({
        defaultSortItems: props.sort,
        listId: props.id
    }, (sortItems, fromLocalStorage, fromUrl) => {
        if (!fromLocalStorage && !fromUrl) return;
        setQueryParams(params => {
            return {
                ...params,
                orderBy: sortItems
            }
        });
    });

    useSearchItemInit(props.search);

    const infiniteLoadingQuery = useInfiniteQuery<InfiniteLoaderResult>([queryKey, queryParams], {
        route,
        queryParams
    }, {
        enabled: variant.name === "infiniteLoading"
    });

    const paginationQuery = useQuery<PagerResult>([queryKey, queryParams, itemsPerPage, parseInt(page)], {
        route,
        queryParams: {
            ...queryParams,
            page: parseInt(page),
            itemsPerPage
        }
    }, {
        enabled: variant.name === "pagination"
    });

    const infiniteLoadingQueryCount = useInfiniteQueryCount(infiniteLoadingQuery);
    const paginationQueryCount = paginationQuery.data?.items
        ? paginationQuery.data.items.length
        : 0

    // useEffect
    // ---------
    useEffect(() => {
        if (!debouncedSearchItem) return;
        const oldFilterParams = [...queryParams.filter || []].filter((filterItem: TFilterItem) => {
            return filterItem.property !== debouncedSearchItem.property;
        });
        setQueryParams({
            ...queryParams,
            filter: [...oldFilterParams, debouncedSearchItem]
        });
    }, [debouncedSearchItem]);

    const handleDrawerApply = (type: TDrawer) => {
        const itemsToSet = type === "filter"
            ? filterItems
            : sortItems;

        // MayBe: provide a utility for this
        if ((type === "filter" && currentUserSettings.allowFilterItemsByUrl) ||
            (type === "orderBy" && currentUserSettings.allowSortItemsByUrl)) {
            setUrlParam(`${type}-${props.id}`, itemsToSet);
        }
        if ((type === "filter" && currentUserSettings.allowFilterItemsByLocalStorage) ||
            (type === "orderBy" && currentUserSettings.allowSortItemsByLocalStorage)) {
            localStorage.setItem(`${type}-${props.id}`, JSON.stringify(itemsToSet))
        }

        if (type === "filter" && searchItem) {
            setQueryParams({
                ...queryParams,
                [type]: [...itemsToSet, searchItem]
            });
        }
        else {
            setQueryParams({
                ...queryParams,
                [type]: itemsToSet
            });
        }
    }

    const handleDrawerReset = (type: TDrawer) => {
        if (type === "filter") {
            const newFilterItems = [...filterItems];
            newFilterItems.forEach(filterItem => {
                filterItem.value = undefined;
            });
            setFilterItems(newFilterItems);
            localStorage.removeItem(`filter-${props.id}`);
            deleteUrlParam(`filter-${props.id}`);
        }
        else {
            const newFilterItems = [...sortItems];
            setSortItems(newFilterItems);
            localStorage.removeItem(`orderBy-${props.id}`);
            deleteUrlParam(`orderBy-${props.id}`);
        }

        const newQueryParams = { ...queryParams };

        if (type === "filter" && searchItem) {
            newQueryParams.filter = [searchItem]
        }
        else {
            delete newQueryParams[type];
        }

        setQueryParams(newQueryParams);
    }

    const useFilter = props.filter.length > 0;
    const useSort = props.sort.length > 0
    const useSearch = !!searchItem
    const headerIsVisible = header?.title || header?.showCount || useSearch || useSort || useFilter || props.onAdd;

    return (
        <div className="grid grid-cols-12">
            {headerIsVisible && <>
                <ListHeader
                    count={variant.name === "infiniteLoading" ? infiniteLoadingQueryCount : paginationQueryCount}
                    title={header?.title}
                    showCount={header?.showCount}
                    useSearch={useSearch}
                    useSort={useSort}
                    useFilter={useFilter}
                    onAdd={props.onAdd}
                />
            </>}
            <ListBody
                useFilter={useFilter}
                variant={variant}
                filterProps={{
                    onFilterApply: () => handleDrawerApply("filter"),
                    onFilterReset: () => handleDrawerReset("filter")
                }}
                listProps={{
                    page: parseInt(page),
                    setPage,
                    itemsPerPage,
                    setItemsPerPage,
                    listItemRender,
                    paginationQuery,
                    infiniteLoadingQuery,
                    loadingDisplay: props.loadingDisplay
                }}
            />
            <SortDrawer
                onDrawerBodyRefChange={(drawerBody) => drawerRef.current = drawerBody}
                inputs={<SortItems />}
                onApply={() => handleDrawerApply("orderBy")}
                onReset={() => handleDrawerReset("orderBy")}
            />
        </div>
    );
}

export default List;