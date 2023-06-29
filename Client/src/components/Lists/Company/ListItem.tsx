import DefaultListItem from "src/components/List/ListItem";
import ListItemContent from "./ListItemContent";

function ListItem({ item }: { item }) {
	return <DefaultListItem content={<ListItemContent item={item} />} />;
}

export default ListItem;
