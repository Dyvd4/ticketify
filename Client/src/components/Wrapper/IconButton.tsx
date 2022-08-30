import { IconButton as ChakraIconButton, IconButtonProps as ChakraIconButtonProps } from "@chakra-ui/react";
import { mapColorProps } from "src/utils/component";
import { forwardRef } from "react";

export type IconButtonProps = {
    icon: React.ReactNode
    circle?: boolean
    backgroundColor?: Tailwind.Color
} & ChakraIconButtonProps

const IconButton = forwardRef((props: IconButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
    const {
        icon,
        circle,
        backgroundColor = {
            value: "bg-gray-300",
            hover: "bg-gray-200",
            darkMode: {
                value: "bg-gray-500",
                hover: "bg-gray-400"
            }
        },
        className,
        ...rest
    } = props;
    return (
        <ChakraIconButton
            ref={ref}
            className={`text-black dark:text-white
                        ${circle ? "rounded-full" : "rounded-lg"} 
                        ${mapColorProps([backgroundColor])}
                        ${className}`}
            icon={icon}
            {...rest} />
    );
})

export default IconButton;