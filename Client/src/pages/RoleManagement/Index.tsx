import { Container } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";
import UserList from "./components/UserList";

type _UserManagementIndexProps = {};

export type UserManagementIndexProps = _UserManagementIndexProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _UserManagementIndexProps>;

function UserManagementIndex({ className, ...props }: UserManagementIndexProps) {
	useBreadcrumb([
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Role management",
			href: "#",
			isCurrentPage: true,
		},
	]);
	return (
		<Container>
			<UserList />
			<br />
		</Container>
	);
}

export default UserManagementIndex;
