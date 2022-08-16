import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton, { IconButtonProps } from "src/components/Wrapper/IconButton";
import { useToggle as useToggleDarkMode } from 'src/hooks/darkmode';

type DarkModeButtonProps = {
} & Omit<IconButtonProps, "icon">

function DarkModeButton(props: DarkModeButtonProps) {
    const [darkModeActive, toggleDarkMode] = useToggleDarkMode();
    return <IconButton
        onClick={(toggleDarkMode as () => boolean)}
        icon={<FontAwesomeIcon icon={(darkModeActive ? faMoon : faSun)} />}
        {...props}
    />;
}

export default DarkModeButton;