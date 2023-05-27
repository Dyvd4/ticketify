import classNames from "classnames";
import { twMerge } from "tailwind-merge";

export function mapColorProps(colors: Array<Tailwind.Color | undefined>) {
    const className = colors
        .filter((color) => !!color)
        .reduce((map, color) => {
            color = color as Tailwind.Color;
            map += ` ${color.value} hover:${color.hover}
                dark:${color.darkMode?.value || color.value} dark:hover:${
                color.darkMode?.hover || color.hover
            }`;
            return map;
        }, "");
    return className;
}

export function cn() {
    //return classNames() twMerge()
}
