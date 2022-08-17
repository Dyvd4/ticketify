import { useAtom } from "jotai";
import { sidebarAtom } from "src/context/atoms";

function BgCover() {
    const [sidebarActive] = useAtom(sidebarAtom);
    return <div id="bg-cover" className={`${!sidebarActive ? "inactive-v" : ""}`}></div>
}

export default BgCover;