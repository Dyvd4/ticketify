import { useAtom } from "jotai";
import { ComponentPropsWithRef, PropsWithChildren, useEffect, useState } from "react";
import filterItemsAtom from "src/components/List/context/atoms/filterItemsAtom";
import searchItemAtom from "src/components/List/context/atoms/searchItemAtom";
import sortItemsAtom from "src/components/List/context/atoms/sortItemsAtom";
import useFilterItemsInit from "src/components/List/context/hooks/useFilterItemsInit";
import useSearchItemInit from "src/components/List/context/hooks/useSearchItemInit";
import useSortItemsInit from "src/components/List/context/hooks/useSortItemsInit";
import { useQuery } from "src/hooks/query";
import useDebounce from "src/hooks/useDebounce";
import { useCurrentUserSettings } from "src/hooks/user";
import { useUrlParams } from "src/hooks/useUrlParams";
import { deleteUrlParam, setUrlParam } from "src/utils/url";
import { TSearchItem } from "..";
import { ITEMS_PER_PAGE_STEPS } from "../../Pager/PagerSection";
import { TFilterItem } from "../Filter/FilterItems";
import ListHeader from "../ListHeader";
import usePagingInfo from "../Result/hooks/usePagingInfo";
import { PagerResult } from "../Result/PagerResultItems";
import { TSortItem } from "../Sort/SortItems";
import { initOrderByDirectionActiveMap } from "../Sort/utils/sortColumns";
import ListBody from "./TableListBody";
import ListFooter from "./TableListFooter";

export type _ListProps = {
    fetch: {
        /** used for react-query */
        queryKey: string;
        /** the url path to fetch the entity from */
        route: string;
    };
    listItemRender(listItem): React.ReactElement;
    loadingDisplay?: JSX.Element;
    header?: {
        title?: string;
        showCount?: boolean;
    };
    /**
     * - unique `id` for the list
     * - the `id` is used to create a relation between the filter and sort items in the local storage and the list
     */
    id: string;
    columns: TSortItem[];
    filter: TFilterItem[];
    search?: TSearchItem;
    onAdd?(...args: any[]): void;
};

export type ListProps = PropsWithChildren<_ListProps> &
    Omit<ComponentPropsWithRef<"div">, keyof _ListProps>;

function List({ className, ...props }: ListProps) {
    const {
        listItemRender,
        fetch: { queryKey, route },
        header,
    } = props;

    const [queryParams, setQueryParams] = useState<any>({});
    const [page, setPage] = useUrlParams("page", 1);
    const [filterItems, setFilterItems] = useAtom(filterItemsAtom);
    const [sortItems] = useAtom(sortItemsAtom);
    const [searchItem] = useAtom(searchItemAtom);
    const { value: debouncedSearchItem } = useDebounce(searchItem);
    const { currentUserSettings } = useCurrentUserSettings();
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_STEPS[0] as number);

    useFilterItemsInit(
        {
            defaultFilterItems: props.filter,
            listId: props.id,
        },
        (filterItems, fromLocalStorage, fromUrl) => {
            if (!fromLocalStorage && !fromUrl) return;
            setQueryParams((params) => {
                return {
                    ...params,
                    filter: filterItems,
                };
            });
        }
    );

    useSortItemsInit(
        {
            defaultSortItems: props.columns,
            listId: props.id,
        },
        (sortItems, fromLocalStorage, fromUrl) => {
            initOrderByDirectionActiveMap(sortItems);
            setQueryParams((params) => {
                return {
                    ...params,
                    orderBy: sortItems,
                };
            });
        }
    );

    useSearchItemInit(props.search);

    const paginationQuery = useQuery<PagerResult>(
        [queryKey, queryParams, sortItems, itemsPerPage, parseInt(page)],
        {
            route,
            queryParams: {
                ...queryParams,
                page: parseInt(page),
                orderBy: sortItems,
                itemsPerPage,
            },
        }
    );
    const paginationQueryCount = paginationQuery.data?.items
        ? paginationQuery.data.items.length
        : 0;
    const pagingInfo = usePagingInfo(paginationQuery);

    // useEffect
    // ---------
    useEffect(() => {
        if (!debouncedSearchItem) return;
        const oldFilterParams = [...(queryParams.filter || [])].filter(
            (filterItem: TFilterItem) => {
                return filterItem.property !== debouncedSearchItem.property;
            }
        );
        setQueryParams({
            ...queryParams,
            filter: [...oldFilterParams, debouncedSearchItem],
        });
    }, [debouncedSearchItem]);

    useEffect(() => {
        if (!pagingInfo) return;
        if (pagingInfo.pagesCountShrunk) {
            setPage(pagingInfo.nextPage); // nearest possible page
        }
    }, [pagingInfo?.pagesCountShrunk]);

    const handleFilterApply = () => {
        if (currentUserSettings.allowFilterItemsByUrl) {
            setUrlParam(`filter-${props.id}`, filterItems);
        }
        if (currentUserSettings.allowFilterItemsByLocalStorage) {
            localStorage.setItem(`filter-${props.id}`, JSON.stringify(filterItems));
        }
        setQueryParams({
            ...queryParams,
            filter: searchItem ? [...filterItems, searchItem] : filterItems,
        });
    };

    const handleFilterReset = () => {
        const newFilterItems = [...filterItems];
        newFilterItems.forEach((filterItem) => {
            filterItem.value = undefined;
        });
        setFilterItems(newFilterItems);
        localStorage.removeItem(`filter-${props.id}`);
        deleteUrlParam(`filter-${props.id}`);
        const newQueryParams = {
            ...queryParams,
            filter: searchItem ? [searchItem] : [],
        };
        setQueryParams(newQueryParams);
    };

    const useFilter = props.filter.length > 0;
    const useSearch = !!searchItem;
    const headerIsVisible =
        header?.title || header?.showCount || useSearch || useFilter || props.onAdd;

    return (
        <>
            <div className="grid grid-cols-12">
                {headerIsVisible && (
                    <>
                        <ListHeader
                            count={paginationQueryCount}
                            title={header?.title}
                            showCount={header?.showCount}
                            useSearch={!!searchItem}
                            useSort={false}
                            useFilter={useFilter}
                            onAdd={props.onAdd}
                        />
                    </>
                )}
                <ListBody
                    useFilter={useFilter}
                    listProps={{
                        query: paginationQuery,
                        listItemRender: listItemRender,
                        columns: props.columns,
                    }}
                    filterProps={{
                        onFilterApply: handleFilterApply,
                        onFilterReset: handleFilterReset,
                    }}
                />
                <ListFooter
                    useFilter={useFilter}
                    pagerSectionProps={{
                        pagingInfo: pagingInfo,
                        itemsPerPage: itemsPerPage,
                        setItemsPerPage: setItemsPerPage,
                        page: parseInt(page),
                        setPage: setPage,
                    }}
                />
            </div>
        </>
    );
}

export default List;
