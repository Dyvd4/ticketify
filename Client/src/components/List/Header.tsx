import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Heading, useDisclosure } from "@chakra-ui/react";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "../Wrapper/IconButton";

type HeaderProps = {
    title: string
    count: number
    showCount?: boolean
    sortInputs?: React.ReactNode
    filterInputs?: React.ReactNode
}

function Header(props: HeaderProps) {
    const { title, count, showCount, sortInputs, filterInputs } = props;
    const { isOpen: sortDrawerActive, onOpen: setSortDrawerActive, onClose: setSortDrawerInActive } = useDisclosure();
    const { isOpen: filterDrawerActive, onOpen: setFilterDrawerActive, onClose: setFilterDrawerInActive } = useDisclosure();
    return (
        <Heading className="text-center my-8 dark:text-gray-400 mb-2 flex justify-center items-center gap-2">
            <>
                <span>
                    {title}
                </span>
                {showCount && <>
                    ({count})
                </>}
                {!!sortInputs && <>
                    <IconButton
                        size={"sm"}
                        onClick={setFilterDrawerActive}
                        aria-label="filter"
                        icon={<FontAwesomeIcon icon={faFilter} />}
                    />
                </>}
                {!!filterInputs && <>
                    <IconButton
                        size={"sm"}
                        onClick={setSortDrawerActive}
                        aria-label="sort"
                        icon={<FontAwesomeIcon icon={faSort} />}
                    />
                </>}
                {/* sort */}
                <Drawer isOpen={sortDrawerActive}
                    placement={"right"}
                    onClose={setSortDrawerInActive}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Sort
                        </DrawerHeader>
                        <DrawerBody>
                            {sortInputs}
                        </DrawerBody>
                        <DrawerFooter>
                            <Button
                                onClick={setSortDrawerInActive}
                                variant="outline"
                                mr={3}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" mr={3}>Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                {/* filter */}
                <Drawer isOpen={filterDrawerActive}
                    placement={"right"}
                    onClose={setFilterDrawerInActive}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            Filter
                        </DrawerHeader>
                        <DrawerBody>
                            {filterInputs}
                        </DrawerBody>
                        <DrawerFooter>
                            <Button
                                onClick={setFilterDrawerInActive}
                                variant="outline"
                                mr={3}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" mr={3}>Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        </Heading>
    );
}

export default Header;