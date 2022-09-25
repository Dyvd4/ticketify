import { Alert, AlertIcon, Divider, List as ChakraList, ListItem, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import { useFilterParams } from "src/components/List/Private/hooks/useFilterParams";
import { useOrderByParams } from "src/components/List/Private/hooks/useOrderByParams";
import { useUrlParams } from "src/hooks/useUrlParams";
import { setUrlParam } from "src/utils/url";
import LoadingRipple from "../Loading/LoadingRipple";
import Pager from "../Pager/Pager";
import FilterDrawer from "./Filter/Private/FilterDrawer";
import Header from "./Header";
import SortDrawer from "./Sort/Private/SortDrawer";

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
    sort?: React.ReactNode
    filter?: React.ReactNode
    add?: {
        /** the url path to where you can add the entity */
        route: string
    }
}

function List(props: ListProps) {
    const { listItemRender, fetch: { queryKey, route }, header } = props;

    // sort, filter, page
    const drawerRef = useRef<HTMLDivElement | null>(null);
    const { filterParamsUrl, setFilterParamsUrl, resetFilterParamsUrl } = useFilterParams(drawerRef);
    const { orderByParamsUrl, setOrderByParamsUrl, resetOrderByParamsUrl } = useOrderByParams(drawerRef);
    const [page, setPage] = useUrlParams("page", 1);

    // query
    const { isLoading, isError, data, refetch } = useQuery([queryKey, page, filterParamsUrl, orderByParamsUrl], () => {
        return fetchEntity({ route: `${route}${window.location.search}` })
    })

    const listItems = data?.items || [];

    const pagingInfo = data?.pagesCount && data?.currentPage
        ? {
            pagesCount: data.pagesCount,
            currentPage: data.currentPage,
            pagesCountShrunk: data?.pagesCountShrunk
        }
        : null;

    // useEffect
    useEffect(() => {
        if (data && data.items && props.fetch.onResult) props.fetch.onResult(data.items)
    }, [data, props])

    useEffect(() => {
        if (pagingInfo?.pagesCountShrunk) {
            setUrlParam("page", pagingInfo.currentPage);
        }
    });

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
        refetch();
    }
    return (
        <>
            {header && <>
                <Header
                    title={header.title}
                    count={listItems.length}
                    showCount={header?.showCount}
                    useSort={!!props.sort}
                    useFilter={!!props.filter}
                    add={props.add}
                />
                <Divider />
            </>}
            <SortDrawer
                onDrawerBodyRefChange={(drawerBody) => drawerRef.current = drawerBody}
                inputs={props.sort}
                fetch={{ queryKey, route }}
                onApply={setOrderByParamsUrl}
                onReset={resetOrderByParamsUrl}
            />
            <FilterDrawer
                onDrawerBodyRefChange={(drawerBody) => drawerRef.current = drawerBody}
                inputs={props.filter}
                fetch={{ queryKey, route }}
                onApply={setFilterParamsUrl}
                onReset={resetFilterParamsUrl}
            />
            <ChakraList className="p-4 flex flex-col gap-4 dark:text-gray-400">
                {isLoading && <div className="flex justify-center items-center">
                    <LoadingRipple />
                </div>}
                {isError && !isLoading && <>
                    <Alert className="rounded-md" status="error" variant="top-accent">
                        <AlertIcon />
                        <Text>
                            There was an error processing your request
                        </Text>
                    </Alert>
                </>}
                {listItems.map((listItem) => (
                    <ListItem className="rounded-lg p-4 grid grid-cols-12 bg-gray-400 dark:bg-gray-700" key={listItem.id}>
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
                                            text-primary`}>
                                        <FontAwesomeIcon icon={faEllipsisVertical} size="xs" />
                                    </MenuButton>
                                    <MenuList>
                                        {listItemRender(listItem).actions}
                                    </MenuList>
                                </Menu>
                            </div>
                        </>}
                    </ListItem>
                ))}
            </ChakraList>
            {!!pagingInfo && <>
                <Divider />
                <Pager
                    centered
                    onChange={handlePageChange}
                    pagesCount={pagingInfo.pagesCount}
                    currentPage={pagingInfo.currentPage}
                />
            </>}
        </>
    );
}

export default List;