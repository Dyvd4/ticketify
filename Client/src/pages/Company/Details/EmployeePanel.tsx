import { List, TabPanel } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { UseInfiniteQueryResult } from "react-query";
import { InfiniteLoaderResultItems } from "src/components/List/Result";
import UserListItem from "src/components/Lists/User/UserListItem";
import { cn } from "src/utils/component";

type _EmployeePanelProps = {
	query: UseInfiniteQueryResult<any, any>;
};

export type EmployeePanelProps = _EmployeePanelProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _EmployeePanelProps>;

function EmployeePanel({ className, query, ...props }: EmployeePanelProps) {
	return (
		<TabPanel className={cn("", className)} {...props}>
			<List className="flex flex-col gap-4">
				<InfiniteLoaderResultItems variant={"intersection-observer"} query={query}>
					{(user) => <UserListItem item={user} key={user.id} />}
				</InfiniteLoaderResultItems>
			</List>
		</TabPanel>
	);
}

export default EmployeePanel;
