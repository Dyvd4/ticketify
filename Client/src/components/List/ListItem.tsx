import { Box, Button, ListItem as ChakraListItem, Menu, MenuButton, MenuList } from "@chakra-ui/react";
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
            data-testid="ListItem"
            {...props}
            _light={{
                backgroundColor: "gray.200"
            }}
            bgColor={"gray.700"}
            className={`rounded-lg p-4 grid grid-cols-12 ${className}`}>
            <Box className={`${!!actions ? "col-span-10" : "col-span-12"}`}>
                {content}
            </Box>
            {!!actions && <>
                <Box className="col-span-2 justify-self-end">
                    <Menu>
                        <MenuButton
                            aria-label="actions"
                            as={Button}
                            colorScheme="cyan"
                            className={`rounded-full p-2 h-6
                                        flex justify-center items-center`}>
                            <FontAwesomeIcon icon={faEllipsisVertical} size="1x" />
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