import { Avatar, Box, Heading, Link } from "@chakra-ui/react";

function TicketListItemContent({ item }: { item }) {
	return (
		<Box className="flex items-center gap-6">
			<Avatar size={"lg"} name={item.name} src={item.avatar?.file?.url} />
			<Box className="flex flex-col items-end gap-2">
				<Link href={`/Company/Details/${item.id}`}>
					<Heading className="m-0 text-xl">{item.name}</Heading>
				</Link>
			</Box>
		</Box>
	);
}

export default TicketListItemContent;
