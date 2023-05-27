import { useAtom } from "jotai";
import { useEffect } from "react";
import { sidebarIsCollapsedAtom } from "../atoms";

const useSidebarToggle = () => {
    const [sidebarIsCollapsed, setSidebarIsCollapsed] = useAtom(sidebarIsCollapsedAtom);

    useEffect(() => {
        const rootElement = document.querySelector<HTMLElement>(":root")!;
        if (sidebarIsCollapsed) {
            rootElement.style.setProperty("--sidebar-width", "75px");
        } else {
            rootElement.style.setProperty("--sidebar-width", "200px");
        }
    }, [sidebarIsCollapsed]);

    const toggleSidebarIsCollapsed = () => setSidebarIsCollapsed(!sidebarIsCollapsed);

    return [sidebarIsCollapsed, toggleSidebarIsCollapsed] as const;
};

export default useSidebarToggle;
