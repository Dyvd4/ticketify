import { Divider, Link, UnorderedList } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { sidebarAtom } from "src/context/atoms";
import ListItem from "./ListItem";

function Sidebar() {
    const [sidebarActive] = useAtom(sidebarAtom);
    const path = window.location.pathname;
    return (
        <div className={`transform ${sidebarActive ? "" : "-translate-x-full"}
                        transition-all absolute z-50
                        border-gray-400 border-t w-full
                        flex flex-col bg-gray-700`}>
            <UnorderedList className="m-0">
                <Link href="/">
                    <ListItem active={path === "/"}>Tickets</ListItem>
                </Link>
                <Divider />
                <Link href="Comments">
                    <ListItem active={path === "/Comments"}>Comments</ListItem>
                </Link>
            </UnorderedList>
            <div className="absolute inset-full bg-black opacity-60 z-40"></div>
        </div>
    );
}

export default Sidebar;