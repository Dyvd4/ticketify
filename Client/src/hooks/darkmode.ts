import { useColorMode } from "@chakra-ui/react";

export function useToggle() {
    let { colorMode, toggleColorMode } = useColorMode();
    const toggle = () => {
        toggleColorMode();
        colorMode = localStorage.getItem("chakra-ui-color-mode") as "light" | "dark";
        const isActive = document.documentElement.classList.toggle("dark", colorMode === "dark");
        return isActive;
    }
    return [colorMode === "dark", toggle]
}

// maybe wrong usage of hook?
export function useApply() {
    const colorMode = localStorage.getItem("chakra-ui-color-mode");
    document.documentElement.classList.toggle("dark", colorMode === "dark");
}