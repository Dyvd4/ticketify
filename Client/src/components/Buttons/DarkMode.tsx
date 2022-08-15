import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import { toggle as ToggleDarkMode } from 'src/utils/darkmode';
import Icon, { IconType } from '../Icons/Icon';

interface DarkModeButtonProps {
    type: IconType
    backgroundColor?: Tailwind.Color
}

interface DarkModeButtonState { }

class DarkModeButton extends React.Component<DarkModeButtonProps, DarkModeButtonState> {
    state = {
        darkModeEnabled: false
    }
    render() {
        return <Icon
            backgroundColor={this.props.backgroundColor}
            type={this.props.type}
            onClick={() => this.setState({ darkModeEnabled: ToggleDarkMode() })}
            icon={(this.state.darkModeEnabled ? faMoon : faSun)} />;
    }
}

export default DarkModeButton;