import { Container } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import UserList from "src/components/Lists/User";
import useBreadcrumb from "src/context/hooks/useBreadcrumbs";

type _UserIndexProps = {};

export type UserIndexProps = _UserIndexProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _UserIndexProps>;

function UserIndex({ className, ...props }: UserIndexProps) {
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

export default UserIndex;
