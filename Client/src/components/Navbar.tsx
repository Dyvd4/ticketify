import { faSliders, faUser, faHome } from "@fortawesome/free-solid-svg-icons";
import DarkModeButton from "./Buttons/DarkMode";
import { Link } from "@chakra-ui/react";
import IconButton from "./Wrapper/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type NavbarProps = {}

function Navbar(props: NavbarProps) {
    return (
        <nav className="w-full bg-gray-400 dark:bg-gray-700 flex justify-between p-2">
            <div>
                <Link href="/">
                    <IconButton circle
                        size="sm"
                        aria-label="Homepage"
                        icon={<FontAwesomeIcon icon={faHome} />} />
                </Link>
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