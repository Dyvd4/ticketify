import { Heading } from "@chakra-ui/react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BgBox from "src/components/BgBox";
import IconLink from "src/components/IconLink";
import { getTitle } from "src/utils/ticket";

type TicketListItemProps = {
	item: any;
};

function TicketListItem({ item }: TicketListItemProps) {
	return (
		<BgBox key={item.id} className="flex w-full items-center justify-between gap-2 p-2">
			<Heading className="min-w-0">
				<IconLink href={`/Ticket/Details/${item.id}`} className="text-base">
					<span className="mr-2 truncate">{getTitle(item)}</span>
				</IconLink>
			</Heading>
			<div className="text-secondary flex items-center gap-1 text-xs">
				<FontAwesomeIcon icon={faUser} />
				{item.responsibleUser?.username || "-"}
			</div>
		</BgBox>
	);
}

export default TicketListItem;
