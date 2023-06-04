import { Heading } from "@chakra-ui/react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BgBox, { BgBoxProps } from "src/components/BgBox";
import IconLink from "src/components/IconLink";
import { cn } from "src/utils/component";
import { getTitle } from "src/utils/ticket";

type _TicketListItemProps = {
	item: any;
};

type TicketListItemProps = _TicketListItemProps & Omit<BgBoxProps, keyof _TicketListItemProps>;

function TicketListItem({ item, className, ...props }: TicketListItemProps) {
	return (
		<BgBox
			key={item.id}
			className={cn("flex w-full items-center justify-between gap-2 p-2", className)}
			{...props}
		>
			<Heading className="min-w-0">
				<IconLink href={`/Ticket/Details/${item.id}`} className="flex text-base">
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
