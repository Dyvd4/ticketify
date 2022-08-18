import { Alert, AlertIcon, Container, Divider, IconButton, List as ChakraList, ListItem, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import { defaultBackgroundColor } from "src/data/tailwind";
import { mapColorProps } from "src/utils/component";
import LoadingRipple from "../Loading/LoadingRipple";
import Header from "./Header";


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
    const { isLoading, isError, data: listItems = [] } = useQuery([queryKey], () => fetchEntity({ route }))
    useEffect(() => {
        if (listItems.length > 0 && props.fetch.onResult) props.fetch.onResult(listItems)
    }, [listItems, props.fetch])
    return (
        <Container>
            <>
                {header && <>
                    <Header
                        title={header.title}
                        count={listItems.length}
                        showCount={header?.showCount}
                        sortInputs={props.sortInputs}
                        filterInputs={props.filterInputs} />
                    <Divider />
                </>}
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
                    {listItems.map((listItem, index) => (
                        <ListItem className="rounded-lg p-4 grid grid-cols-12 bg-gray-400 dark:bg-gray-700" key={index}>
                            <div className="col-span-10">
                                {listItemRender(listItem).content}
                            </div>
                            {!!listItemRender(listItem).actions && <>
                                <div className="w-fit justify-self-end col-span-2">
                                    <Menu>
                                        <MenuButton
                                            aria-label="actions"
                                            as={IconButton}
                                            icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
                                            className={`rounded-full text-black dark:text-white ${mapColorProps(undefined, defaultBackgroundColor)}`}
                                        />
                                        <MenuList>
                                            {listItemRender(listItem).actions}
                                        </MenuList>
                                    </Menu>
                                </div>
                            </>}
                        </ListItem>
                    ))}
                </ChakraList>
            </>
        </Container>
    );
}

export default List;