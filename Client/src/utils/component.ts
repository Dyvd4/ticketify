export function mapColorProps(colors: Array<Tailwind.Color | undefined>) {
    const className = colors
        .filter(color => !!color)
        .reduce((map, color) => {
            color = color as Tailwind.Color;
            map += ` ${color.value} hover:${color.hover}
                dark:${color.darkMode?.value} dark:hover:${color.darkMode?.hover}`
            return map;
        }, "");
    return className;
}