import { ComponentPropsWithRef, PropsWithChildren } from "react";
import List from "src/components/List";
import UserListItem from "./UserListItem";

type _UserListProps = {};

export type UserListProps = _UserListProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _UserListProps>;

function UserList({ className, ...props }: UserListProps) {
	return (
		<List
			variant={{
				name: "infiniteLoading",
				variant: {
					name: "intersection-observer",
				},
			}}
			id="6802edfd-85e0-41d7-818a-b477ab056d54"
			fetch={{
				route: "users-with-avatar",
				queryKey: "users-with-avatar",
			}}
			listItemRender={(item) => <UserListItem item={item} key={item.id} />}
			header={{
				showCount: true,
			}}
			sort={[]}
			filter={[]}
			search={{
				property: "username",
				type: "string",
				operation: {
					value: "contains",
				},
				label: "search by username",
			}}
		/>
	);
}

export default UserList;
