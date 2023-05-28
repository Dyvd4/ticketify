import { LinkOverlay } from "@chakra-ui/react";
import DefaultListItemHeading from "../../List/ListItemHeading";

type ListItemHeadingProps = {};

function ListItemHeading({ item }: { item }) {
	const title = `#${item.id} ${item.title}`;

	return (
		<LinkOverlay href={`/Ticket/Details/${item.id}`}>
			<DefaultListItemHeading>{title}</DefaultListItemHeading>
		</LinkOverlay>
	);
}

export default ListItemHeading;
