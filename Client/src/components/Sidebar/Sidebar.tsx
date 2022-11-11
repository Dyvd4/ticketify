import { Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Link, UnorderedList } from "@chakra-ui/react";
import { faFireFlameCurved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { sidebarAtom } from "src/context/atoms";
import ListItem from "./ListItem";

function Sidebar() {
    const [sidebarActive, setSidebarActive] = useAtom(sidebarAtom);
    const path = window.location.pathname;
    return (
        <Drawer isOpen={sidebarActive}
            placement={"left"}
            onClose={() => setSidebarActive(false)}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader className="flex items-center gap-2">
                    Ticketify
                    <FontAwesomeIcon icon={faFireFlameCurved} />
                </DrawerHeader>
                <DrawerBody>
                    <UnorderedList className="m-0">
                        <Link href="/Ticket">
                            <ListItem active={path === "/Ticket"}>Tickets</ListItem>
                        </Link>
                        <Divider />
                        <Link href="/Log">
                            <ListItem active={path === "/Log"}>Logs</ListItem>
                        </Link>
                        <Divider />
                        <Link href="/Test">
                            <ListItem active={path === "/Test"}>Test</ListItem>
                        </Link>
                    </UnorderedList>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

export default Sidebar;