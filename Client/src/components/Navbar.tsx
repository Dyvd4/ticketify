import { Avatar, Box, Flex, HStack, Link, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars, faSignOut, faSliders, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "react-query";
import { signOut } from "src/auth/auth";
import useSidebarToggle from "src/context/hooks/useSidebarToggle";
import { useCurrentUserWithAuthentication } from "src/hooks/user";
import DarkModeButton from "./Buttons/DarkMode";
import IconButton from "./Wrapper/IconButton";

type NavbarProps = {}

function Navbar(props: NavbarProps) {

	const { currentUser, isAuthenticated } = useCurrentUserWithAuthentication({ includeAllEntities: true });
	const [, toggleSidebarIsCollapsed] = useSidebarToggle();

	const signOutMutation = useMutation(signOut, {
		onSuccess: () => {
			window.location.href = "/";
		}
	});

	if (!isAuthenticated) return null;

	return (
		<Box
			as="nav"
			id="navbar"
			className="border-b-2 inline-flex justify-between p-2 z-50"
			backgroundColor={"gray.900"}
			_light={{
				backgroundColor: "white"
			}}>
			<div className="flex items-center gap-2">
				<IconButton
					onClick={toggleSidebarIsCollapsed}
					size="sm"
					aria-label="Homepage"
					icon={<FontAwesomeIcon icon={faBars} />} />
			</div>
			<HStack gap={1}>
				<DarkModeButton
					size="sm"
					aria-label="Toggle dark mode" />
				<Menu>
					<MenuButton>
						<Flex
							alignItems={"center"}
							gap={2}>
							<Avatar
								className="ring-2 ring-sky-500"
								size={"sm"}
								name={currentUser?.username}
								src={currentUser?.avatar?.url}
							/>
						</Flex>
					</MenuButton>
					<MenuList>
						<Link href="/User">
							<MenuItem icon={<FontAwesomeIcon icon={faUser} />}>
								Profile data
							</MenuItem>
						</Link>
						<Link href="/UserSettings">
							<MenuItem icon={<FontAwesomeIcon icon={faSliders} />}>
								Settings
							</MenuItem>
						</Link>
						<MenuItem
							color="red"
							onClick={() => signOutMutation.mutate()}
							icon={<FontAwesomeIcon icon={faSignOut} />}>
							sign out
						</MenuItem>
					</MenuList>
				</Menu>
			</HStack>
		</Box>
	);
}

export default Navbar;