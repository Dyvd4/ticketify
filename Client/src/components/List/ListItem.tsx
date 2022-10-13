import { Box, ListItem as ChakraListItem, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef } from "react";

type ListItemProps = {
    /** the content to display */
    content: React.ReactElement,
    /** this should be menuItems from chakra */
    actions?: React.ReactElement
} & ComponentPropsWithRef<"li">

function ListItem({ content, actions, className, ...props }: ListItemProps) {
    return (
        <ChakraListItem
            {...props}
            className={`rounded-lg p-4 grid grid-cols-12
                     bg-gray-400 dark:bg-gray-700 text-white ${className}`}>
            <Box className={`${!!actions ? "col-span-10" : "col-span-12"}`}>
                {content}
            </Box>
            {!!actions && <>
                <Box className="col-span-2 justify-self-end">
                    <Menu>
                        <MenuButton
                            aria-label="actions"
                            as="button"
                            className={`rounded-full p-2 w-6 h-6
                                      text-black dark:text-white
                                        flex justify-center items-center
                                        bg-primary`}>
                            <FontAwesomeIcon icon={faEllipsisVertical} size="xs" />
                        </MenuButton>
                        <MenuList>
                            {actions}
                        </MenuList>
                    </Menu>
                </Box>
            </>}
        </ChakraListItem>
    );
}

export default ListItem;