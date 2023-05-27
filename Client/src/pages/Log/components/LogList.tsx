import List from "src/components/List/List";
import LogListItem from "./LogListItem";
import LogListItemSkeleton from "./LogListItemSkeleton";

type LogListProps = {}

function LogList(props: LogListProps) {
    return (
        <>
            <List
                variant={{
                    name: "infiniteLoading",
                    variant: {
                        name: "intersection-observer"
                    }
                }}
                id="6802edfd-85e0-41d7-818a-b2e7ab0c6d54"
                fetch={{
                    route: "logs",
                    queryKey: "logs"
                }}
                listItemRender={(item) => <LogListItem item={item} key={item.id} />}
                loadingDisplay={<>{new Array(3).fill(undefined).map((num, i) => <LogListItemSkeleton key={i} />)}</>}
                header={{
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
                        property: "message",
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
            />
            <br />
        </>
    );
}

export default LogList;