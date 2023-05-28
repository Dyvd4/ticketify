import { TicketTableList } from "src/components/Lists/Ticket";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";

interface IndexProps {}

function Index(props: IndexProps) {
	useBreadcrumb([
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Tickets",
			href: "#",
			isCurrentPage: true,
		},
	]);

	return (
		<>
			<TicketTableList />
		</>
	);
}

export default Index;
