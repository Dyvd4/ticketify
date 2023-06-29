import List from "src/components/List/List";
import ListItem from "./ListItem";

type CompanyListProps = {};

function CompanyList(props: CompanyListProps) {
	return (
		<List
			variant={{
				name: "infiniteLoading",
				variant: {
					name: "intersection-observer",
				},
			}}
			id="e72e4f55-d438-4f30-aaf6-a5c872f61e19"
			fetch={{
				route: "companies-with-avatar",
				queryKey: "company",
			}}
			listItemRender={(item) => <ListItem item={item} />}
			header={{
				showCount: true,
			}}
			sort={[]}
			filter={[]}
			search={{
				property: "name",
				type: "string",
				operation: {
					value: "contains",
				},
				label: "search by name",
			}}
		/>
	);
}

export default CompanyList;
