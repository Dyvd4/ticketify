import { Box, Divider, Input, InputGroup, InputLeftElement, InputRightElement, Kbd, Modal, ModalContent, ModalOverlay, UnorderedList, useDisclosure } from '@chakra-ui/react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, PropsWithChildren, useEffect, useRef } from 'react';
import useKeyPosition from 'src/hooks/useKeyPosition';
import SearchBarListItem from './SearchBarListItem';

type _SearchBarProps = {}

const listItems = [
    {
        description: "Leon H",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "David Kimmich",
        title: "#32 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Timo Hu",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Leon H",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "David Kimmich",
        title: "#32 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Timo Hu",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Leon H",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "David Kimmich",
        title: "#32 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Timo Hu",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Leon H",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "David Kimmich",
        title: "#32 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Timo Hu",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Leon H",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "David Kimmich",
        title: "#32 fdsfdsfdsfds",
        href: "#"
    },
    {
        description: "Timo Hu",
        title: "#40 fdsfdsfdsfds",
        href: "#"
    }
]

export type SearchBarProps = PropsWithChildren<_SearchBarProps> &
    Omit<ComponentPropsWithRef<'div'>, keyof _SearchBarProps>

function SearchBar({ className, ...props }: SearchBarProps) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [keyPosition, setKeyPosition] = useKeyPosition(listItems.length - 1);

    useEffect(() => {
        window.addEventListener("keydown", e => {
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault();
                inputRef.current!.click();
            }
        })
    }, [])

    return (
        <>
            <InputGroup
                ref={inputRef}
                onClick={onOpen}
                className={`${className} cursor-pointer`}
                {...props}>
                <InputLeftElement>
                    <FontAwesomeIcon icon={faSearch} />
                </InputLeftElement>
                <Input
                    className='cursor-pointer'
                    type={"search"}
                    placeholder="search for ticket"
                />
                <InputRightElement
                    className='flex gap-2'
                    width={"fit-content"}
                    pr={"2"}>
                    <Kbd>Ctrl</Kbd>
                    +
                    <Kbd>K</Kbd>
                </InputRightElement>
            </InputGroup>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent className='' maxHeight={"80vh"}>
                    <Box className='p-4'>
                        <Box className='flex flex-row items-center gap-6 p-4'>
                            <FontAwesomeIcon icon={faSearch} />
                            <Input
                                variant={"unstyled"}
                                style={{
                                    backgroundColor: "transparent",
                                }}
                                className="text-lg"
                                placeholder="search for ticket"
                                type={"search"}
                            />
                        </Box>
                        <Divider />
                    </Box>
                    <UnorderedList className='pl-4 pb-4 pr-4 flex flex-col gap-2 m-0 overflow-y-scroll'>
                        {listItems.map((item, index) => (
                            <SearchBarListItem
                                onMouseOver={() => setKeyPosition(index)}
                                enableHoverColors
                                isActive={index === keyPosition}
                                {...item}
                            />
                        ))}
                    </UnorderedList>
                </ModalContent>
            </Modal>
        </>
    );
}

export default SearchBar;