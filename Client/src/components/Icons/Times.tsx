import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Component, ReactNode } from 'react';
import Tooltip, { ToolTipDirection } from '../ToolTip';

interface TimesIconProps {
    className?: string
    onClick?(...params: any[]): void
    tooltip?: {
        title: string
        direction?: ToolTipDirection
    }
    backgroundColor?: Tailwind.Color
}

interface TimesIconState {

}
export default class TimesIcon extends Component<TimesIconProps, TimesIconState> {
    static defaultProps = {
        backgroundColor: {
            value: "gray-300",
            hover: "gray-200",
            darkMode: {
                value: "gray-500",
                hover: "gray-400"
            }
        }
    }
    render(): ReactNode {
        const { tooltip, className, onClick } = this.props;
        if (tooltip?.title) {
            return (
                <Tooltip onClick={onClick} title={tooltip.title} direction={tooltip.direction}>
                    <div className={`rounded-full w-6 h-6 cursor-pointer
                            bg-gray-200 active:bg-gray-300 hover:text-red-600  
                              inline-flex justify-center items-center ${className}`}>
                        <FontAwesomeIcon icon={faTimes} size="sm" />
                    </div>
                </Tooltip>
            )
        }
        return (
            <div onClick={onClick}
                className={`rounded-full w-6 h-6 cursor-pointer
                bg-gray-200 active:bg-gray-300 hover:text-red-600  
                  inline-flex justify-center items-center ${className}`}>
                <FontAwesomeIcon icon={faTimes} size="sm" />
            </div>
        )
    }
}