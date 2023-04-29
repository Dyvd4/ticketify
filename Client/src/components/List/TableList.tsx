import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAtom } from 'jotai';
import { ComponentPropsWithRef, PropsWithChildren, useEffect, useRef, useState } from 'react';
import filterItemsAtom from 'src/components/List/context/atoms/filterItemsAtom';
import searchItemAtom from 'src/components/List/context/atoms/searchItemAtom';
import sortItemsAtom from 'src/components/List/context/atoms/sortItemsAtom';
import useFilterItemsInit from 'src/components/List/context/hooks/useFilterItemsInit';
import useSearchItemInit from 'src/components/List/context/hooks/useSearchItemInit';
import useSortItemsInit from 'src/components/List/context/hooks/useSortItemsInit';
import { useQuery } from 'src/hooks/query';
import useDebounce from 'src/hooks/useDebounce';
import { useCurrentUserSettings } from 'src/hooks/user';
import { useUrlParams } from 'src/hooks/useUrlParams';
import { deleteUrlParam, setUrlParam } from 'src/utils/url';
import { TDrawer, TSearchItem } from '.';
import ErrorAlert from '../ErrorAlert';
import LoadingRipple from '../Loading/LoadingRipple';
import PagerSection, { ITEMS_PER_PAGE_STEPS } from '../Pager/PagerSection';
import FilterDrawer from './Filter/FilterDrawer';
import FilterItems, { TFilterItem } from './Filter/FilterItems';
import usePagingInfo from './Result/hooks/usePagingInfo';
import ListResultItems from './Result/ListResultItems';
import { PagerResult } from './Result/PagerResultItems';
import { TSortItem } from './Sort/SortItems';
import TableListHeader from './TableListHeader';

type _TestListProps = {
    fetch: {
        /** used for react-query */
        queryKey: string
        /** the url path to fetch the entity from */
        route: string
    }
    listItemRender(listItem): React.ReactElement
    loadingDisplay?: JSX.Element
    header?: {
        title: string
        showCount?: boolean
    }
    /**
     * - unique `id` for the list
     * - the `id` is used to create a relation between the filter and sort items in the local storage and the list
     */
    id: string
    columns: TSortItem[]
    filter: TFilterItem[]
    search?: TSearchItem
    onAdd?(...args: any[]): void
}

export type TestListProps = PropsWithChildren<_TestListProps> &
    Omit<ComponentPropsWithRef<'div'>, keyof _TestListProps>

function TestList({ className, ...props }: TestListProps) {

    const {
        listItemRender,
        fetch: { queryKey, route },
        header
    } = props;

    const drawerRef = useRef<HTMLDivElement | null>(null);

    const [queryParams, setQueryParams] = useState<any>({});
    const [page, setPage] = useUrlParams("page", 1);
    const [filterItems, setFilterItems] = useAtom(filterItemsAtom);
    const [sortItems, setSortItems] = useAtom(sortItemsAtom);
    const [searchItem] = useAtom(searchItemAtom);
    const { value: debouncedSearchItem } = useDebounce(searchItem)
    const { currentUserSettings } = useCurrentUserSettings();
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_STEPS[0] as number);

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
        defaultSortItems: props.columns,
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

    const paginationQuery = useQuery<PagerResult>([queryKey, queryParams, itemsPerPage, parseInt(page)], {
        route,
        queryParams: {
            ...queryParams,
            page: parseInt(page),
            itemsPerPage
        }
    });
    const paginationQueryCount = paginationQuery.data?.items
        ? paginationQuery.data.items.length
        : 0;
    const pagingInfo = usePagingInfo(paginationQuery);

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

    useEffect(() => {
        if (!pagingInfo) return;
        if (pagingInfo.pagesCountShrunk) {
            setPage(pagingInfo.nextPage); // nearest possible page
        }
    }, [pagingInfo?.pagesCountShrunk]);

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
        delete newQueryParams[type];
        setQueryParams(newQueryParams);
    }

    const handleItemsPerPageChange = (itemsPerPage: number) => {
        setItemsPerPage(itemsPerPage);
        setQueryParams({
            ...queryParams,
            itemsPerPage
        })
    }

    return (
        <>
            {header && <>
                <TableListHeader
                    count={paginationQueryCount}
                    title={header.title}
                    showCount={header.showCount}
                    useSearch={!!searchItem}
                    useFilter={props.filter.length > 0}
                    onAdd={props.onAdd}
                />
            </>}
            <FilterDrawer
                onDrawerBodyRefChange={(drawerBody) => drawerRef.current = drawerBody}
                inputs={<FilterItems />}
                onApply={() => handleDrawerApply("filter")}
                onReset={() => handleDrawerReset("filter")}
            />
            <TableContainer className='border rounded-md mt-4'>
                <Table variant='simple' >
                    <Thead>
                        <Tr>
                            {props.columns.map(column => (
                                <Th key={column.property}>
                                    <div className="flex gap-2 items-center">
                                        <span>
                                            {column.label}
                                        </span>
                                        <FontAwesomeIcon icon={faCaretUp} />
                                        {/* <FontAwesomeIcon icon={faCaretDown} /> */}
                                    </div>
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody ref={(listRef) => listRef && autoAnimate(listRef)}>
                        {paginationQuery.isLoading && <>
                            <Tr>
                                <LoadingRipple centered />
                            </Tr>
                        </>}
                        {paginationQuery.isError && <>
                            <ErrorAlert />
                        </>}
                        {!paginationQuery.isLoading && !paginationQuery.isError && <>
                            <ListResultItems
                                as={"tr"}
                                variant={"pagination"}
                                emptyDisplay={<>
                                    <Tr>
                                        <Td colSpan={props.columns.length}>
                                            This list seems to be empty 😴
                                        </Td>
                                    </Tr>
                                </>}
                                data={paginationQuery.data}>
                                {item => listItemRender(item)}
                            </ListResultItems>
                        </>}
                    </Tbody>
                </Table>
            </TableContainer>
            {!!pagingInfo && <>
                <PagerSection
                    itemsPerPageStep={itemsPerPage}
                    itemsPerPageChange={handleItemsPerPageChange}
                    pagerProps={{
                        onChange: setPage,
                        pagesCount: pagingInfo.pagesCount,
                        currentPage: parseInt(page)
                    }}
                />
            </>}
        </>
    );
}

export default TestList;