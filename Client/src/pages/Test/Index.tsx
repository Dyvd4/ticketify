import { Button, Container, MenuItem, Tag } from "@chakra-ui/react";
import { faDownload, faEdit, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchEntity } from "src/api/entity";
import List from "src/components/List/List";
import ListItem from "src/components/List/ListItem";
import ListItemHeading from "src/components/List/ListItemHeading";
import ListItemContent from "./ListItemContent";

interface IndexProps { }

function Index(props: IndexProps) {

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
        <Container>
            <List
                variant={{
                    name: "infiniteLoading",
                    variant: {
                        name: "load-more-button"
                    }
                }}
                id="6ed914af-4959-4920-8327-1bec3dccebc7"
                fetch={{
                    route: "dummy/test",
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
            />
            <Button onClick={makeRequest}>
                Make Request
            </Button>
        </Container>
    )
}

export default Index;
