import List from "src/components/List/List";
import LogListItem from "./LogListItem";

type LogListProps = {}

function LogList(props: LogListProps) {
    return (
        <List
            fetch={{
                route: "logs",
                queryKey: "logs"
            }}
            listItemRender={(item) => <LogListItem item={item} />}
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

    );
}

export default LogList;