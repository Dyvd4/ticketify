import { Container } from "@chakra-ui/react";
import CompanyList from "src/components/Lists/Company/List";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";

type IndexProps = {};

function Index(props: IndexProps) {
	useBreadcrumb([
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Companies",
			href: "#",
			isCurrentPage: true,
		},
	]);

	return (
		<Container>
			<CompanyList />
			<br />
		</Container>
	);
}
export default Index;
