import {
	Avatar,
	Box,
	Flex,
	HStack,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { faSignOut, faSliders, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "react-query";
import { signOut } from "src/auth/auth";
import useAuthState from "src/auth/hooks/useAuthState";
import Breadcrumb from "./Breadcrumb";
import DarkModeButton from "./Buttons/DarkMode";
import SearchBar from "./SearchBar";

type NavbarProps = {};

function Navbar(props: NavbarProps) {
	const { currentUser, isAuthenticated } = useAuthState();

	const signOutMutation = useMutation(signOut, {
		onSuccess: () => {
			window.location.href = "/";
		},
	});

	if (!isAuthenticated) return null;

	return (
		<Box
			as="nav"
			id="navbar"
			className="z-50 inline-flex justify-between border-b p-2"
			backgroundColor={"gray.900"}
			_light={{
				backgroundColor: "white",
			}}
		>
			<Breadcrumb />
			<HStack gap={1}>
				<SearchBar />
				<DarkModeButton size="sm" aria-label="Toggle dark mode" />
				<Menu>
					<MenuButton>
						<Flex alignItems={"center"} gap={2}>
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
							icon={<FontAwesomeIcon icon={faSignOut} />}
						>
							sign out
						</MenuItem>
					</MenuList>
				</Menu>
			</HStack>
		</Box>
	);
}

export default Navbar;
