import List from "src/components/List/List";
import LogListItem from "./LogListItem";
import LogListItemSkeleton from "./LogListItemSkeleton";

type LogListProps = {}

function LogList(props: LogListProps) {
    return (
        <>
            <List
                id="6802edfd-85e0-41d7-818a-b2e7ab0c6d54"
                fetch={{
                    route: "logs",
                    queryKey: "logs"
                }}
                listItemRender={(item) => <LogListItem item={item} />}
                loadingDisplay={<>{new Array(3).fill(undefined).map(() => <LogListItemSkeleton />)}</>}
                header={{
                    title: "Logs",
                    showCount: true
                }}
                sort={[
                    {
                        property: "createdAt"
                    },
                    {
                        property: "level",
                    },
                    {
                        property: "message"
                    },
                ]}
                filter={[
                    {
                        property: "message",
                        type: "string"
                    },
                    {
                        property: "errorMessage",
                        label: "error message",
                        type: "string"
                    },
                    {
                        property: "errorStack",
                        label: "error stack",
                        type: "string"
                    },
                    {
                        property: "level",
                        type: "string"
                    }
                ]}
            />
            <br />
        </>
    );
}

export default LogList;