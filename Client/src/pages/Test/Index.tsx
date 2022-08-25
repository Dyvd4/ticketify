import List from "src/components/List/List";
import ListItemContent from "./ListItemContent";
import ListItemFilter from "./ListItemFilter";
import ListItemSort from "./ListItemSort";

interface IndexProps { }

function Index(props: IndexProps) {
    return (
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
            sort={<ListItemSort />}
            filter={<ListItemFilter />}
        />
    )
}

export default Index;
