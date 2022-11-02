import { Avatar, Flex, HStack, Link, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faBars, faSignOut, faSliders, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { signOut } from "src/auth/auth";
import { sidebarAtom } from "src/context/atoms";
import { useCurrentUserWithAuthentication } from "src/hooks/user";
import { getDataUrl } from "src/utils/image";
import DarkModeButton from "./Buttons/DarkMode";
import IconButton from "./Wrapper/IconButton";

type NavbarProps = {}

function Navbar(props: NavbarProps) {

    const { currentUser, isAuthenticated } = useCurrentUserWithAuthentication({ includeAllEntities: true });
    const [sidebarActive, setSidebarActive] = useAtom(sidebarAtom);

    if (!isAuthenticated) return null;

    return (
        <nav className="w-full border-b-2 flex justify-between p-2">
            <IconButton circle
                onClick={() => setSidebarActive(!sidebarActive)}
                size="sm"
                aria-label="Homepage"
                icon={<FontAwesomeIcon icon={faBars} />} />
            <HStack gap={1}>
                <DarkModeButton circle
                    size="sm"
                    aria-label="Toggle darkmode" />
                <Link href="/Settings">
                    <IconButton circle
                        size="sm"
                        aria-label="Settings"
                        icon={<FontAwesomeIcon icon={faSliders} />} />
                </Link>
                <Menu>
                    <MenuButton>
                        <Flex
                            alignItems={"center"}
                            gap={2}>
                            <Avatar
                                className="ring-2 ring-sky-500"
                                size={"sm"}
                                name={currentUser?.username}
                                src={currentUser.avatar
                                    ? getDataUrl(currentUser.avatar.content, currentUser.avatar.mimeType)
                                    : undefined}
                            />
                        </Flex>
                    </MenuButton>
                    <MenuList>
                        <Link href="/User">
                            <MenuItem icon={<FontAwesomeIcon icon={faUser} />}>
                                Profile data
                            </MenuItem>
                        </Link>
                        <MenuItem
                            color="red"
                            onClick={signOut}
                            icon={<FontAwesomeIcon icon={faSignOut} />}>
                            sign out
                        </MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
        </nav>
    );
}

export default Navbar;