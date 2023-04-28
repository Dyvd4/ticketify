import { Button, Td } from "@chakra-ui/react";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchEntity } from "src/api/entity";
import TestList from "src/components/List/TableList";
import IconButton from "src/components/Wrapper/IconButton";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import SearchBar from "../../components/SearchBar/SearchBar";

interface IndexProps { }

function Index(props: IndexProps) {

    useBreadcrumb([{ name: "/", isCurrentPage: true }])

    const makeRequest = async () => {
        const objWithNested = {
            randomProp: "haha",
            anotherProp: "hehe",
            nestedObj: {
                someNestedProp: "fhdsjkfhs",
                someNestedArrProp: ["fdsfds", "fhdjskhfjk"]
            }
        };
        await fetchEntity({
            route: "dummy/getWithObjectUrlParams",
            queryParams: objWithNested

        });
    }

    return (
        <>
            <TestList
                header={{
                    title: "test",
                    showCount: true
                }}
                id="5802edfd-85e0-41d7-818a-b2e7ab0c6d54"
                filter={
                    [
                        {
                            property: "isAmazing",
                            type: "boolean",
                            label: "Is amazing"
                        },
                        {
                            property: "createdAt",
                            type: "date",
                            label: "created at"
                        }
                    ]
                }
                fetch={{
                    route: "dummy/test/pager",
                    queryKey: "test"
                }}
                columns={[
                    {
                        property: "isAmazing",
                        label: "is amazing"
                    },
                    {
                        property: "createdAt",
                        label: "created at"
                    },
                    {
                        property: "description",
                        label: "description"
                    },
                ]}
                listItemRender={(item) => (
                    <>
                        <Td>{String(item.isAmazing)}</Td>
                        <Td>{item.createdAt}</Td>
                        <Td className="">{item.description}</Td>
                    </>
                )}
                search={{
                    property: "description",
                    type: "string",
                    operation: {
                        value: "contains"
                    },
                    label: "search by description"
                }}
            >
            </TestList>
            {/* <ColumnList
                variant={{
                    name: "infiniteLoading",
                    variant: {
                        name: "intersection-observer"
                    }
                }}
                id="5802edfd-85e0-41d7-818a-b2e7ab0c6d54"
                fetch={{
                    route: "logs",
                    queryKey: "logs"
                }}
                listItemRender={(item) => (
                    <Tr key={item.id}>
                        <Td>{item.level}</Td>
                        <Td>{item.createdAt}</Td>
                        <Td>{item.message}</Td>
                    </Tr>
                )}
                header={{
                    title: "Logs",
                    showCount: true
                }}
                columns={[
                    {
                        property: "level",
                        label: "level"
                    },
                    {
                        property: "createdAt",
                        label: "created at"
                    },
                    {
                        property: "message",
                        label: "message"
                    },
                ]}
                filter={[
                    {
                        property: "message",
                        type: "string"
                    },
                    {
                        property: "stack",
                        label: "error stack",
                        type: "string"
                    },
                    {
                        property: "level",
                        type: "string"
                    }
                ]}
                search={{
                    property: "message",
                    type: "string",
                    operation: {
                        value: "contains"
                    },
                    label: "search by message"
                }}
            /> */}
            <br />
            <SearchBar />
            <br />
            <IconButton
                aria-label="test"
                circle
                icon={<FontAwesomeIcon size="sm" icon={faThumbTack} />}
            />
            {/* <List
                variant={{
                    name: "pagination"
                }}
                id="6ed914af-4959-4920-8327-1bec3dccebc7"
                fetch={{
                    route: "dummy/test/pager",
                    queryKey: "test"
                }}
                listItemRender={(item) => (
                    <ListItem
                        useDivider
                        heading={
                            <ListItemHeading>
                                This is a fairly creative heading
                            </ListItemHeading>
                        }
                        actions={<>
                            <MenuItem
                                icon={<FontAwesomeIcon icon={faEdit} />}>
                                Edit
                            </MenuItem>
                            <MenuItem
                                icon={<FontAwesomeIcon icon={faDownload} />}>
                                Download
                            </MenuItem>
                            <MenuItem
                                icon={<FontAwesomeIcon icon={faImage} />}>
                                Save as image
                            </MenuItem>
                        </>}
                        content={<ListItemContent item={item} />}
                        tags={[
                            <Tag colorScheme={"red"}>Tag</Tag>,
                            <Tag colorScheme={"green"}>Tag</Tag>,
                            <Tag colorScheme={"cyan"}>Tag</Tag>,
                        ]}
                    />
                )}
                header={{
                    title: "test",
                    showCount: true
                }}
                search={{
                    label: "search for description",
                    property: "description",
                    operation: {
                        value: "contains"
                    },
                    type: "string"
                }}
                sort={[
                    {
                        property: "isAmazing",
                        label: "Is amazing"
                    },
                    {
                        property: "description",
                    },
                    {
                        property: "createdAt",
                        label: "created at"
                    }
                ]}
                filter={[
                    {
                        property: "isAmazing",
                        type: "boolean",
                        label: "Is amazing"
                    },
                    {
                        property: "description",
                        type: "string",
                    },
                    {
                        property: "createdAt",
                        type: "date",
                        label: "created at"
                    }
                ]}
            /> */}
            <Button onClick={makeRequest}>
                Make Request
            </Button>
        </>
    )
}

export default Index;

