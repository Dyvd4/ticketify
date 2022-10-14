import { ListItem as ChakraListItem, ListItemProps as ChakraListItemProps } from "@chakra-ui/react";

type ListItemProps = {
    active?: boolean
} & ChakraListItemProps

function ListItem(props: ListItemProps) {
    const { children, active, ...rest } = props;
    return (
        <ChakraListItem
            className={`${active ? "border-black dark:border-white border-l-4 bg-gray-200 dark:bg-gray-500" : ""} 
                                    hover:bg-gray-300 dark:hover:bg-gray-600
                                     list-none p-2 cursor-pointer`}
            {...rest}>
            {children}
        </ChakraListItem>
    );
}

export default ListItem;