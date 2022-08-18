import { IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps } from "@chakra-ui/react";
import { mapColorProps } from "src/utils/component";

export type IconButtonProps = {
    icon: React.ReactNode
    circle?: boolean
    backgroundColor?: Tailwind.Color
} & ChakraIconButtonProps

function IconButton(props: IconButtonProps) {
    const {
        icon,
        circle,
        backgroundColor = {
            value: "gray-300",
            hover: "gray-200",
            darkMode: {
                value: "gray-500",
                hover: "gray-400"
            }
        },
        className,
        ...rest
    } = props;
    return (
        <ChakraIconButton
            className={`text-black dark:text-white
                        ${circle ? "rounded-full" : "rounded-lg"} 
                        ${mapColorProps(undefined, backgroundColor)}
                        ${className}`}
            icon={icon}
            {...rest} />
    );
}

export default IconButton;