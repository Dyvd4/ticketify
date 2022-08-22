import React from "react";
import { mapColorProps } from "src/utils/component";

type ButtonProps = React.PropsWithChildren<{}>
    & React.PropsWithColor
    & React.ComponentPropsWithRef<"button">

const Button: React.FunctionComponent<ButtonProps> = (props) => {
    const { children, className, twColor, twBackgroundColor, ...buttonProps } = props;
    return (
        <button
            onClick={props.onClick}
            className={`rounded-md cursor-pointer 
            ${mapColorProps([twColor, twBackgroundColor])} ${className}`}
            {...buttonProps}>
            {children}
        </button>
    )
}

export default Button;