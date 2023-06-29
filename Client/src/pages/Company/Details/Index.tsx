import { Alert, AlertIcon, Tab, Text } from "@chakra-ui/react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import DetailsPage from "src/components/DetailsPage";
import LoadingRipple from "src/components/Loading/LoadingRipple";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import { useInfiniteQuery, useInfiniteQueryCount, useQuery } from "src/hooks/query";
import CompanyDetailsHeadSection from "./CompanyDetailsHeadSection";
import EmployeePanel from "./EmployeePanel";
import TicketsPanel from "./TicketsPanel";

type IndexProps = {};

function Index(props: IndexProps) {
	useBreadcrumb([
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Company",
			href: "#",
			isCurrentPage: true,
		},
	]);
	const { id } = useParams();

	const { data: company, ...companyQuery } = useQuery(["company", id], {
		route: "company",
		entityId: id,
	});

	const ticketQuery = useInfiniteQuery<any, any>(["companyTickets"], {
		route: `company/${id}/tickets`,
	});
	const ticketQueryCount = useInfiniteQueryCount(ticketQuery);

	const employeeQuery = useInfiniteQuery<any, any>(["users-with-avatar", id], {
		route: `users-with-avatar`,
		queryParams: {
			companyId: id,
		},
	});
	const employeeQueryCount = useInfiniteQueryCount(employeeQuery);

	if (companyQuery.isLoading || ticketQuery.isLoading || employeeQuery.isLoading) {
		return <LoadingRipple usePortal />;
	}

	if (companyQuery.isError || ticketQuery.isError || employeeQuery.isError) {
		return (
			<Alert className="rounded-md" status="error" variant="top-accent">
				<AlertIcon />
				<Text>There was an error processing your request</Text>
			</Alert>
		);
	}

	return (
		<DetailsPage
			head={<CompanyDetailsHeadSection company={company} />}
			body={{
				tabList: [
					<Tab>
						tickets ({ticketQueryCount}) &nbsp;
						<FontAwesomeIcon icon={faTicketSimple} />
					</Tab>,
					<Tab>
						employees ({employeeQueryCount}) &nbsp;
						<FontAwesomeIcon icon={faUser} />
					</Tab>,
				],
				tabPanels: [
					<TicketsPanel query={ticketQuery} />,
					<EmployeePanel query={employeeQuery} />,
				],
			}}
		/>
	);
}
export default Index;
