import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { toggle as ToggleDarkMode } from 'src/utils/darkmode';
import IconButton, { IconButtonProps } from "src/components/Wrapper/IconButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';

type DarkModeButtonProps = {
} & Omit<IconButtonProps, "icon">

function DarkModeButton(props: DarkModeButtonProps) {
    const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(Boolean(parseInt(Cookies.get("darkmode") || "")));
    return <IconButton
        onClick={() => setDarkModeEnabled(ToggleDarkMode())}
        icon={<FontAwesomeIcon icon={(darkModeEnabled ? faMoon : faSun)} />}
        {...props}
    />;
}

export default DarkModeButton;