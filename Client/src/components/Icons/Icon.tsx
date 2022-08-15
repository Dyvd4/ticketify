import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Component } from 'react';

export type IconType = "circle" | "rounded"

interface IconProps {
    icon: any
    type?: IconType
    onClick?(...params: any[]): void
    size?: SizeProp
    backgroundColor?: Tailwind.Color
}

interface IconState { }

class Icon extends Component<IconProps, IconState> {
    static defaultProps: IconProps = {
        icon: faQuestion,
        type: "circle",
        size: "1x",
        backgroundColor: {
            value: "gray-300",
            hover: "gray-200",
            darkMode: {
                value: "gray-500",
                hover: "gray-400"
            }
        }
    }
    render() {
        const { icon, size, type, backgroundColor, onClick } = this.props;
        let borderRadius = (type === "circle") ? "rounded-full" : "rounded-lg";
        return <div
            onClick={onClick}
            className={`inline-flex justify-center items-center 
            cursor-pointer ${borderRadius} p-2
            bg-${backgroundColor?.value} hover:bg-${backgroundColor?.hover}
            dark:bg-${backgroundColor?.darkMode?.value} dark:hover:bg-${backgroundColor?.darkMode?.hover}`}>
            <FontAwesomeIcon icon={icon} size={size} />
        </div>
    }
}

export default Icon;