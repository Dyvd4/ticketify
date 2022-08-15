import Cookies from "js-cookie";

export function toggle() {
    const isActive = document.documentElement.classList.toggle("dark");
    Cookies.set("darkmode", isActive ? "1" : "0");
    return isActive;
}

export function apply() {
    const isActive = Boolean(parseInt(Cookies.get("darkmode") || ""));
    document.documentElement.classList.toggle("dark", isActive);
}