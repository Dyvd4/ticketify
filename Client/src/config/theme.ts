import { ThemeConfig } from "@chakra-ui/react";

export const initialColorMode = (localStorage.getItem("chakra-ui-color-mode") || "dark") as "light" | "dark" | "system";

export const themeConfig: ThemeConfig = {
    initialColorMode,
    useSystemColorMode: false
}