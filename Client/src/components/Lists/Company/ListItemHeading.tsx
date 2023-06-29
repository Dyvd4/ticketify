import { LinkOverlay } from "@chakra-ui/react";
import DefaultListItemHeading from "../../List/ListItemHeading";

function ListItemHeading({ item }: { item }) {
	return (
		<LinkOverlay href={`/Company/Details/${item.id}`}>
			<DefaultListItemHeading>{item.name}</DefaultListItemHeading>
		</LinkOverlay>
	);
}

export default ListItemHeading;
