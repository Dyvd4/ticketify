import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import TicketActivityActionBox from "./components/TicketActivityActionBox/TicketActivityActionBox";
import TicketAttachmentsActionBox from "./components/TicketAttachmentsActionBox/TicketAttachmentsActionBox";
import TicketConnectionsActionBox from "./components/TicketConnectionsActionBox/TicketConnectionsActionBox";
import TicketDescriptionActionBox from "./components/TicketDescriptionActionBox/TicketDescriptionActionBox";
import TicketHeadDataActionBox from "./components/TicketHeadDataActionBox/TicketHeadDataActionBox";
import CommentsSection from "./sections/CommentsSection";

function TicketDetailsIndex() {
	useBreadcrumb([
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Details",
			href: "#",
			isCurrentPage: true,
		},
	]);

	return (
		<>
			<div className="grid grid-cols-4 gap-4">
				<div className="col-span-3">
					<TicketDescriptionActionBox />
				</div>
				<div className="display col-span-1 flex flex-col gap-4">
					<TicketHeadDataActionBox />
					<TicketAttachmentsActionBox />
					<TicketConnectionsActionBox />
					<TicketActivityActionBox />
				</div>
			</div>
			<CommentsSection />
		</>
	);
}

export default TicketDetailsIndex;
