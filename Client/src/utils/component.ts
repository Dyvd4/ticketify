export default class Component {
    static getChildrenByType(types: any[], children: any[], inverse = false) {
        if (inverse) return Array.from(children).filter(child => !types.includes(child.props.__TYPE));
        return Array.from(children).filter(child => {
            let test = types.includes(child?.props.__TYPE);
            return test;
        });
    }
    static validateChildrenByType(types: any[], children: any[], inverse = false) {
        Array.from(children).forEach(child => {
            if (inverse && types.includes(child?.props.__TYPE)) throw new Error(`Unexpected child with type: ${child.props.__TYPE} \n expected types: ${types.join(",")} \n inverse: ${inverse}`);
            if (!inverse && !types.includes(child?.props.__TYPE)) throw new Error(`Unexpected child with type: ${child.props.__TYPE} \n expected types: ${types.join(",")} \n inverse: ${inverse}`);
        });
    }
}

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