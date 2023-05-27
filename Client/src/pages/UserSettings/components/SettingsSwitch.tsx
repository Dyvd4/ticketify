import { Box, Flex, Switch, SwitchProps, Text } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";

type SettingsSwitchProps = PropsWithChildren<{
    name: string;
    description?: React.ReactNode;
    switchProps: SwitchProps;
    variant?: "heading" | "normal";
    disabled?: boolean;
}> &
    ComponentPropsWithRef<"div">;

function SettingsSwitch({
    name,
    switchProps,
    description,
    variant = "normal",
    className,
    children,
    disabled,
    ...restProps
}: SettingsSwitchProps) {
    return (
        <Flex
            className={`${variant === "heading" ? "" : "my-2"} gap-2 ${className}`}
            justifyContent={"space-between"}
            alignItems={"center"}
            {...restProps}
        >
            <Box>
                <Text className={`${variant === "heading" ? "text-lg" : "text-base"} font-bold`}>
                    {name}
                </Text>
                {description && (
                    <>
                        <Text className="text-secondary mt-1 text-sm">{description}</Text>
                    </>
                )}
                {children}
            </Box>
            <Switch
                className="switch"
                size={variant === "heading" ? "md" : "sm"}
                disabled={disabled}
                {...switchProps}
            />
        </Flex>
    );
}

export default SettingsSwitch;
