import { Link } from "@chakra-ui/react";
import { faAlignJustify, faSliders, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { sidebarAtom } from "src/context/atoms";
import { useCurrentUser } from "src/hooks/user";
import DarkModeButton from "./Buttons/DarkMode";
import IconButton from "./Wrapper/IconButton";

type NavbarProps = {}

function Navbar(props: NavbarProps) {
    const { currentUser } = useCurrentUser();
    const [sidebarActive, setSidebarActive] = useAtom(sidebarAtom);
    if (!currentUser) return null;
    return (
        <nav className="w-full bg-indigo-500 dark:bg-gray-700 flex justify-between p-2">
            <div>
                <IconButton circle
                    onClick={() => setSidebarActive(!sidebarActive)}
                    size="sm"
                    aria-label="Homepage"
                    icon={<FontAwesomeIcon icon={faAlignJustify} />} />
            </div>
            <div className="flex gap-2">
                <DarkModeButton circle
                    size="sm"
                    aria-label="Toggle darkmode" />
                <Link href="/Settings">
                    <IconButton circle
                        size="sm"
                        aria-label="Settings"
                        icon={<FontAwesomeIcon icon={faSliders} />} />
                </Link>
                <Link href="/User">
                    <IconButton circle
                        size="sm"
                        aria-label="User settings"
                        icon={<FontAwesomeIcon icon={faUser} />} />
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;