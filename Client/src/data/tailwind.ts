export const screens = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
}

export const actionColorInactive = {
    value: "teal-800",
    hover: "teal-700"
}

export const actionBackgroundColorInactive = {
    value: `bg-${actionColorInactive.value}`,
    hover: `bg-${actionColorInactive.hover}`
}

export const actionTextColorInactive = {
    value: `text-${actionColorInactive.value}`,
    hover: `text-${actionColorInactive.hover}`
}

export const actionColor: Tailwind.Color = {
    value: "teal-600",
    hover: "teal-500"
}

export const actionBackgroundColor: Tailwind.Color = {
    value: `bg-${actionColor.value}`,
    hover: `bg-${actionColor.hover}`
}

export const actionTextColor: Tailwind.Color = {
    value: `text-${actionColor.value}`,
    hover: `text-${actionColor.hover}`
}