import { Divider, List as ChakraList } from "@chakra-ui/react";
import autoAnimate from "@formkit/auto-animate";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import useFilterItemsInit from "src/context/hooks/useFilterItemsInit";
import useSearchItemInit from "src/context/hooks/useSearchItemInit";
import useSortItemsInit from "src/context/hooks/useSortItemsInit";
import { filterItemsAtom } from "src/context/stores/filter";
import { searchItemAtom } from "src/context/stores/search";
import { sortItemsAtom } from "src/context/stores/sort";
import { useInfiniteQuery, useInfiniteQueryCount } from "src/hooks/infiniteQuery";
import { useCurrentUserSettings } from "src/hooks/user";
import { useUrlParams } from "src/hooks/useUrlParams";
import { deleteUrlParam, setUrlParam } from "src/utils/url";
import { TDrawer, TSearchItem } from ".";
import LoadingRipple from "../Loading/LoadingRipple";
import Pager from "../Pager/Pager";
import FilterDrawer from "./Filter/FilterDrawer";
import FilterItems, { TFilterItem } from "./Filter/FilterItems";
import Header from "./Header";
import InfiniteQueryItems from "./InfiniteQueryItems";
import SortDrawer from "./Sort/SortDrawer";
import SortItems, { TSortItem } from "./Sort/SortItems";

type ListProps = {
    fetch: {
        /** used for react-query */
        queryKey: string
        /** the url path to fetch the entity from */
        route: string
        onResult?(listItems)
    }
    listItemRender(listItem): React.ReactElement
    loadingDisplay?: JSX.Element
    header?: {
        title: string
        showCount?: boolean
    }
    /**
     * - unique id for the list
     * - the id is used to create a relation between the filter and sort items in the local storage and the list
     */
    id: string
    sort: TSortItem[]
    filter: TFilterItem[]
    search?: TSearchItem
    onAdd?(...args: any[]): void
}

function List(props: ListProps) {
    const { listItemRender, fetch: { queryKey, route }, header } = props;

    const drawerRef = useRef<HTMLDivElement | null>(null);
    // sort, filter, page
    const [filterItems, setFilterItems] = useAtom(filterItemsAtom);
    const [sortItems, setSortItems] = useAtom(sortItemsAtom);
    const [searchItem] = useAtom(searchItemAtom);
    const [queryParams, setQueryParams] = useState<any>({});
    const [page, setPage] = useUrlParams("page", 1, { jsonParse: true });

    const { currentUserSettings } = useCurrentUserSettings();

    useFilterItemsInit({
        defaultFilterItems: props.filter,
        listId: props.id
    }, (filterItems) => {
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
    }, (sortItems) => {
        setQueryParams(params => {
            return {
                ...params,
                orderBy: sortItems
            }
        });
    });
    useSearchItemInit(props.search);

    const query = useInfiniteQuery([queryKey, page, queryParams], {
        route,
        queryParams: {
            ...queryParams,
            page
        }
    }, {
        getNextPageParam: (lastPage: any) => lastPage.type !== "pagination"
            ? lastPage.nextSkip
            : undefined
    });

    const count = useInfiniteQueryCount(query);

    // 🥵
    const pagingResult = query.data?.pages[0]?.type === "pagination"
        ? query.data?.pages[0]
        : null;
    const pagingInfo = pagingResult
        ? {
            pagesCount: pagingResult.pagesCount,
            currentPage: pagingResult.currentPage,
            pagesCountShrunk: pagingResult.pagesCountShrunk
        }
        : null;

    // useEffect
    useEffect(() => {
        if (query.data && query.data.pages && props.fetch.onResult) {
            const allListItems = query.data.pages.reduce((allItems, nextPage) => {
                allItems = allItems.concat(nextPage.items);
                return allItems;
            }, []);
            props.fetch.onResult(allListItems);
        }
    }, [query, props])

    useEffect(() => {
        if (pagingInfo?.pagesCountShrunk) {
            setPage(pagingInfo.currentPage);
        }
    });

    useEffect(() => {
        if (!searchItem) return;
        const oldFilterParams = [...queryParams.filter || []].filter((filterItem: TFilterItem) => {
            return filterItem.property !== searchItem.property;
        });
        setQueryParams({
            ...queryParams,
            filter: [...oldFilterParams, searchItem]
        });
    }, [searchItem]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    }

    const handleDrawerApply = (type: TDrawer) => {
        const itemsToSet = type === "filter"
            ? filterItems
            : sortItems;

        if ((type === "filter" && currentUserSettings.allowFilterItemsByUrl) ||
            (type === "orderBy" && currentUserSettings.allowSortItemsByUrl)) {
            setUrlParam(`${type}-${props.id}`, itemsToSet);
        }
        if ((type === "filter" && currentUserSettings.allowFilterItemsByLocalStorage) ||
            (type === "orderBy" && currentUserSettings.allowSortItemsByLocalStorage)) {
            localStorage.setItem(`${type}-${props.id}`, JSON.stringify(itemsToSet))
        }

        setQueryParams({
            ...queryParams,
            [type]: itemsToSet
        });
    }
    const handleDrawerReset = (type: TDrawer) => {
        if (type === "filter") {
            const newFilterItems = [...filterItems];
            newFilterItems.forEach(filterItem => {
                filterItem.value = undefined;
            });
            setFilterItems(newFilterItems);
            localStorage.removeItem("filter");
            deleteUrlParam("filter");
        }
        else {
            const newFilterItems = [...sortItems];
            setSortItems(newFilterItems);
            localStorage.removeItem("orderBy");
            deleteUrlParam("orderBy");
        }
        const newQueryParams = { ...queryParams };
        delete newQueryParams[type];
        setQueryParams(newQueryParams);
    }

    return (
        <>
            {header && <>
                <Header
                    title={header.title}
                    count={count}
                    showCount={header?.showCount}
                    useSearch={!!searchItem}
                    useSort={props.sort.length > 0}
                    useFilter={props.filter.length > 0}
                    onAdd={props.onAdd}
                />
                <Divider />
            </>}
            <SortDrawer
                onDrawerBodyRefChange={(drawerBody) => drawerRef.current = drawerBody}
                inputs={<SortItems />}
                onApply={() => handleDrawerApply("orderBy")}
                onReset={() => handleDrawerReset("orderBy")}
            />
            <FilterDrawer
                onDrawerBodyRefChange={(drawerBody) => drawerRef.current = drawerBody}
                inputs={<FilterItems />}
                onApply={() => handleDrawerApply("filter")}
                onReset={() => handleDrawerReset("filter")}
            />
            <ChakraList className="p-4 flex flex-col gap-4" ref={(listRef) => listRef && autoAnimate(listRef)}>
                <InfiniteQueryItems
                    // TODO: add option for "load-more-button"- variant in backend?
                    variant="intersection-observer"
                    query={query}
                    loadingDisplay={props.loadingDisplay ||
                        <div className="flex justify-center items-center">
                            <LoadingRipple />
                        </div>
                    }>
                    {listItem => listItemRender(listItem)}
                </InfiniteQueryItems>
            </ChakraList>
            {!!pagingInfo && <>
                <Divider />
                <Pager
                    centered
                    onChange={handlePageChange}
                    pagesCount={pagingInfo.pagesCount}
                    currentPage={pagingInfo.currentPage}
                />
            </>
            }
        </>
    );
}

export default List;