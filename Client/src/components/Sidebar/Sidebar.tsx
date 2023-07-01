import { Box, Divider, Heading, Link, Tooltip } from "@chakra-ui/react";
import { faContactBook } from "@fortawesome/free-regular-svg-icons";
import {
	faArrowLeft,
	faArrowRight,
	faBook,
	faFlask,
	faTicket,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import AuthenticatedArea from "src/auth/AuthenticatedArea";
import useAuthState from "src/auth/hooks/useAuthState";
import BgBox, { BgBoxProps } from "src/components/BgBox";
import useSidebarToggle from "src/context/hooks/useSidebarToggle";
import IconButton from "../Wrapper/IconButton";
import NewTicketSection from "./sections/NewTicketSection";
import PinnedTicketsSection from "./sections/PinnedTicketsSection";
import { SidebarListItem } from "./SidebarListItem";

type _SidebarProps = {};

export type SidebarProps = PropsWithChildren<_SidebarProps> & BgBoxProps;

function Sidebar({ className, ...props }: SidebarProps) {
	const path = window.location.pathname;

	const { isLoading } = useAuthState();
	const [sidebarIsCollapsed, toggleSidebarIsCollapsed] = useSidebarToggle();
	const sidebarListItemVariant = !sidebarIsCollapsed ? "horizontal" : "vertical";
	const { data: ticketCount } = useQuery(["ticketCount"], () =>
		fetchEntity({
			route: "tickets/count",
		})
	);

	const { data: logCount } = useQuery(["logCount"], () =>
		fetchEntity({
			route: "logs/count",
		})
	);

	if (isLoading) return null;

	return (
		<BgBox
			backgroundColor={"gray.800"}
			_light={{
				backgroundColor: "gray.100", // TODO: rethink of better color
			}}
			variant="child"
			as="ul"
			id="sidebar"
			className={classNames(
				`${className} flex h-screen flex-col 
                                    rounded-none`,
				{
					"gap-4": !sidebarIsCollapsed,
					"gap-6": sidebarIsCollapsed,
				}
			)}
			{...props}
		>
			{sidebarListItemVariant === "horizontal" && (
				<>
					<Heading as="h1" className="flex items-center justify-between text-xl">
						<Link href="/" className="no-underline">
							<Tooltip placement="bottom" label="Go to home">
								<Box {...(path === "/" ? { color: "blue.200" } : {})}>
									<FontAwesomeIcon className="mr-2" icon={faTicket} />
									<span>Ticketify</span>
								</Box>
							</Tooltip>
						</Link>
						<IconButton
							backgroundColor={"transparent"}
							size={"sm"}
							aria-label="toggle sidebar"
							icon={<FontAwesomeIcon icon={faArrowLeft} />}
							onClick={toggleSidebarIsCollapsed}
						></IconButton>
					</Heading>
				</>
			)}

			{sidebarListItemVariant === "vertical" && (
				<>
					<IconButton
						backgroundColor={"transparent"}
						className="mx-auto w-fit"
						size={"sm"}
						aria-label="toggle sidebar"
						icon={<FontAwesomeIcon icon={faArrowRight} />}
						onClick={toggleSidebarIsCollapsed}
					></IconButton>
				</>
			)}

			<NewTicketSection />

			<Divider />

			<SidebarListItem
				title="Tickets"
				urlPath={"/Ticket"}
				variant={sidebarListItemVariant}
				icon={faTicket}
				count={ticketCount}
			/>

			<SidebarListItem title="Contacts" variant={sidebarListItemVariant} icon={faContactBook}>
				<SidebarListItem
					variant={sidebarListItemVariant}
					title="Companies"
					urlPath={"/Company"}
				/>
				<SidebarListItem variant={sidebarListItemVariant} title="Users" urlPath={"/User"} />
			</SidebarListItem>

			<SidebarListItem
				title="Logs"
				urlPath="/Log"
				variant={sidebarListItemVariant}
				icon={faBook}
				count={logCount}
			/>

			<AuthenticatedArea roleName="super-admin">
				<SidebarListItem
					title="Test"
					urlPath={"/Test"}
					variant={sidebarListItemVariant}
					icon={faFlask}
				/>
			</AuthenticatedArea>

			<AuthenticatedArea roleName="admin">
				<SidebarListItem
					title="Role Management"
					urlPath={"/RoleManagement"}
					variant={sidebarListItemVariant}
					icon={faUsers}
				/>
			</AuthenticatedArea>

			<Divider />

			<PinnedTicketsSection sidebarListItemVariant={sidebarListItemVariant} />
		</BgBox>
	);
}

export default Sidebar;
