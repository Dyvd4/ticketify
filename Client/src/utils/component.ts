export function mapColorProps(color?: Tailwind.Color, bgColor?: Tailwind.Color) {
    let className = "";
    if (color) {
        className += `text-${color.value} hover:text-${color.hover} 
        dark:text-${color.darkMode?.value} dark:hover:text-${color.darkMode?.hover}`
    }
    if (bgColor) {
        className += ` bg-${bgColor.value} hover:bg-${bgColor.hover} 
        dark:bg-${bgColor.darkMode?.value} dark:hover:bg-${bgColor.darkMode?.hover}`
    }
    return className;
}