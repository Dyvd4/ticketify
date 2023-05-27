import {
    Box,
    Button,
    ListItem as ChakraListItem,
    ListItemProps as ChakraListItemProps,
    Divider,
    LinkBox,
    Menu,
    MenuButton,
    MenuList,
} from "@chakra-ui/react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ListItemProps = {
    /** The title to display. Will be placed on top of the content. */
    heading: React.ReactElement;
    /** actions as menuItems from chakra */
    actions?: React.ReactElement;
    /** content to display */
    content?: React.ReactElement;
    /** tags as tags from chakra */
    tags?: React.ReactElement[];
    /** if set to true, shows divider between slots */
    useDivider?: boolean;
} & ChakraListItemProps;

function ListItem({
    heading,
    content,
    actions,
    tags,
    className,
    useDivider,
    ...props
}: ListItemProps) {
    return (
        <ChakraListItem
            data-testid="ListItem"
            _light={{
                backgroundColor: "gray.200",
            }}
            bgColor={"gray.700"}
            className={`flex flex-col rounded-lg p-4 ${className}`}
            {...props}
        >
            <LinkBox>
                <Box className="flex justify-between">
                    <Box className="flex-grow">{heading}</Box>
                    {!!actions && (
                        <>
                            <Box>
                                <Menu>
                                    <MenuButton
                                        aria-label="actions"
                                        as={Button}
                                        colorScheme="cyan"
                                        className={`flex h-6 items-center
                                justify-center rounded-full p-2`}
                                    >
                                        <FontAwesomeIcon icon={faEllipsisVertical} size="1x" />
                                    </MenuButton>
                                    <MenuList>{actions}</MenuList>
                                </Menu>
                            </Box>
                        </>
                    )}
                </Box>
                {useDivider && !!content && <Divider my="2" />}
                {!!content && (
                    <>
                        <Box className={`${!useDivider ? "mt-1" : ""}`}>{content}</Box>
                    </>
                )}
                {useDivider && !!tags && <Divider my="2" />}
                {!!tags && (
                    <>
                        <Box className={`${!useDivider ? "mt-2" : "mt-1"} flex items-center gap-4`}>
                            {tags}
                        </Box>
                    </>
                )}
            </LinkBox>
        </ChakraListItem>
    );
}

export default ListItem;
