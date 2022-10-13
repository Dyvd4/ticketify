import { Container } from "@chakra-ui/react";
import List from "src/components/List/List";
import ListItem from "src/components/List/ListItem";
import ListItemContent from "./ListItemContent";

interface IndexProps { }

function Index(props: IndexProps) {
    return (
        <Container>
            <List
                fetch={{
                    route: "test",
                    queryKey: "test"
                }}
                listItemRender={(item) => <ListItem content={<ListItemContent item={item} />} />}
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
        </Container>
    )
}

export default Index;
