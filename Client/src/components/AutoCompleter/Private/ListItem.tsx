type ListItemProps = {
    active: boolean
} & React.ComponentPropsWithRef<"li">
function ListItem({ className, children, active, ...rest }: ListItemProps) {
    return (
        <li
            className={`autocomplete-list-item ${active
                ? `autocomplete-list-item-active 
                 bg-gray-200 dark:bg-gray-500 `
                : `dark:bg-gray-700 dark:text-gray-400 text-gray-400
                active:bg-gray-200 dark:active:bg-gray-500`}
                        ${className}`}
            {...rest}>
            {children}
        </li>
    );
}

export default ListItem;