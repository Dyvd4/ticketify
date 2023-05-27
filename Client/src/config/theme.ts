import { extendTheme, StyleFunctionProps, ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const initialColorMode = (localStorage.getItem("chakra-ui-color-mode") || "dark") as
    | "light"
    | "dark"
    | "system";

export const themeConfig: ThemeConfig = {
    initialColorMode,
    useSystemColorMode: false,
};

const theme = extendTheme({
    ...themeConfig,
    styles: {
        global: (props: StyleFunctionProps) => ({
            body: {
                bg: mode("white", "gray.900")(props),
            },
        }),
    },
});

export default theme;
