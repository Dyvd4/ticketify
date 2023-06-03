import { Avatar, Box, Heading, Tag } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { ListItem } from "src/components/List";
import RoleTagConfirmMenu from "./RoleTagConfirmMenu";

type _ComponentProps = {
	item: any;
};

export type ComponentProps = _ComponentProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _ComponentProps>;

function Component({ className, item, ...props }: ComponentProps) {
	const { role, username, ...user } = item;
	return (
		<ListItem
			content={
				<Box>
					<Box className="flex justify-between">
						<Avatar size={"lg"} name={username} src={user.avatar?.file?.url} />
						<Box className="flex flex-col items-end gap-2">
							<Heading className="m-0 text-xl">{username}</Heading>
							<Box className="text-secondary">{user.email}</Box>
							<RoleTagConfirmMenu userId={user.id} role={role} />
						</Box>
					</Box>
				</Box>
			}
		/>
	);
}

export default Component;