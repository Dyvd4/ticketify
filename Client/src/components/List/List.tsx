import { Alert, AlertIcon, Divider, List as ChakraList, ListItem, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import useFilterItemsInit from "src/context/hooks/useFilterItemsInit";
import useSearchItemInit from "src/context/hooks/useSearchItemInit";
import useSortItemsInit from "src/context/hooks/useSortItemsInit";
import { filterItemsAtom, filterItemsResetAtomWithUrl } from "src/context/stores/filter";
import { searchItemAtom } from "src/context/stores/search";
import { sortItemsAtom, sortItemsResetAtomWithUrl } from "src/context/stores/sort";
import useInfiniteQuery from "src/hooks/useInfiniteQuery";
import { useUrlParams } from "src/hooks/useUrlParams";
import { getUrlParam, setUrlParam } from "src/utils/url";
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
    listItemRender(listItem): {
        /** the content to display */
        content: React.ReactNode,
        /** this should be menuItems from chakra */
        actions?: React.ReactNode
    }
    header?: {
        title: string
        showCount?: boolean
    }
    sort: TSortItem[]
    filter: TFilterItem[]
    search?: TSearchItem
    add?: {
        /** the url path to where you can add the entity */
        route: string
    }
}

function List(props: ListProps) {
    const { listItemRender, fetch: { queryKey, route }, header } = props;

    const drawerRef = useRef<HTMLDivElement | null>(null);
    // sort, filter, page
    const [filterItems] = useAtom(filterItemsAtom);
    const [sortItems] = useAtom(sortItemsAtom);
    const [searchItem] = useAtom(searchItemAtom);
    const [, filterItemsReset] = useAtom(filterItemsResetAtomWithUrl);
    const [, sortItemsReset] = useAtom(sortItemsResetAtomWithUrl);
    const [queryParams, setQueryParams] = useState<any>({});
    const [page, setPage] = useUrlParams("page", 1, { jsonParse: true });

    useFilterItemsInit(props.filter, (filterItems) => {
        if (!getUrlParam("filter")) return;
        setQueryParams(params => {
            return {
                ...params,
                filter: filterItems
            }
        });
    });
    useSortItemsInit(props.sort, (sortItems) => {
        if (!getUrlParam("orderBy")) return;
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

    const count = query.data?.pages.reduce((pageCount, nextPage) => {
        pageCount += nextPage.items.length;
        return pageCount;
    }, 0);

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
            setUrlParam("page", pagingInfo.currentPage);
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
        // todo: check if needed
        query.refetch();
    }

    const handleDrawerApply = (type: TDrawer) => {
        const itemsToSet = type === "filter"
            ? filterItems
            : sortItems;
        setUrlParam(type, itemsToSet);
        setQueryParams({
            ...queryParams,
            [type]: itemsToSet
        });
    }
    const handleDrawerReset = (type: TDrawer) => {
        if (type === "filter") filterItemsReset();
        else sortItemsReset();
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
                    add={props.add}
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
            <ChakraList className="p-4 flex flex-col gap-4 dark:text-gray-400">
                <InfiniteQueryItems
                    query={query}
                    loadingDisplay={
                        <div className="flex justify-center items-center">
                            <LoadingRipple />
                        </div>
                    }
                    errorDisplay={
                        <Alert className="rounded-md" status="error" variant="top-accent">
                            <AlertIcon />
                            <Text>
                                There was an error processing your request
                            </Text>
                        </Alert>
                    }>
                    {listItem => (
                        <ListItem className="rounded-lg p-4 grid grid-cols-12 bg-gray-400 dark:bg-gray-700">
                            <div className="col-span-10">
                                {listItemRender(listItem).content}
                            </div>
                            {!!listItemRender(listItem).actions && <>
                                <div className="w-fit justify-self-end col-span-2">
                                    <Menu>
                                        <MenuButton
                                            aria-label="actions"
                                            as="button"
                                            className={`rounded-full p-2 w-6 h-6
                                                      text-black dark:text-white
                                                        flex justify-center items-center
                                                        bg-primary`}>
                                            <FontAwesomeIcon icon={faEllipsisVertical} size="xs" />
                                        </MenuButton>
                                        <MenuList>
                                            {listItemRender(listItem).actions}
                                        </MenuList>
                                    </Menu>
                                </div>
                            </>}
                        </ListItem>
                    )}
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