import { Container } from "@chakra-ui/react";
import List from "src/components/List/List";
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
                listItemRender={(item) => {
                    return {
                        content: <ListItemContent item={item} />
                    }
                }
                }
                header={{
                    title: "test",
                    showCount: true
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
