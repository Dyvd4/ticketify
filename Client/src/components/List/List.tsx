import { Alert, AlertIcon, Container, Divider, List as ChakraList, ListItem, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import { actionBackgroundColor } from "src/data/tailwind";
import { mapColorProps } from "src/utils/component";
import { setUrlParms } from "src/utils/url";
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
    sortInputs?: React.ReactNode
    filterInputs?: React.ReactNode
}

function List(props: ListProps) {
    const { listItemRender, fetch: { queryKey, route }, header } = props;

    // query
    const { isLoading, isError, data, refetch } = useQuery([queryKey, window.location.search], () => {
        return fetchEntity({ route: `${route}${window.location.search}` })
    })

    const listItems = data?.items || [];
    const pagingInfo = data?.pagesCount && data?.currentPage
        ? {
            pagesCount: data.pagesCount,
            currentPage: data.currentPage
        }
        : null;

    // hooks
    useEffect(() => {
        setUrlParms("page", pagingInfo?.currentPage);
        if (data && data.items && props.fetch.onResult) props.fetch.onResult(data.items)
    }, [data, props.fetch, refetch])

    useEffect(() => {
        window.addEventListener("urlParamsChange", () => {
            refetch();
        });
    }, []);

    const handlePageChange = (page) => {
        setUrlParms("page", page);
        refetch()
    }

    return (
        <Container>
            <>
                {header && <>
                    <Header
                        title={header.title}
                        count={listItems.length}
                        showCount={header?.showCount}
                        useSort={!!props.sortInputs}
                        useFilter={!!props.filterInputs} />
                    <Divider />
                </>}
                <SortDrawer
                    inputs={props.sortInputs}
                    fetch={{ queryKey, route }}
                />
                <FilterDrawer
                    inputs={props.filterInputs}
                    fetch={{ queryKey, route }}
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
                                            ${mapColorProps([actionBackgroundColor])}`}
                                        >
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
                        onChange={handlePageChange}
                        pagesCount={pagingInfo.pagesCount}
                        currentPage={pagingInfo.currentPage}
                    />
                </>}
            </>
        </Container>
    );
}

export default List;