import {
	Box,
	Divider,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Kbd,
	Modal,
	ModalContent,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { fetchEntity } from "src/api/entity";
import NavigatableList from "src/components/NavigatableList";
import useDebounce from "src/hooks/useDebounce";
import { ListResultEmptyDisplay } from "../List/Result";
import SearchBarListItem from "./SearchBarListItem";

type _SearchBarProps = {};

export type SearchBarProps = PropsWithChildren<_SearchBarProps> &
	Omit<ComponentPropsWithRef<"div">, keyof _SearchBarProps>;

function SearchBar({ className, ...props }: SearchBarProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [inputValue, setInputValue] = useState("");

	const { value: debouncedInputValue } = useDebounce(inputValue);
	const { isLoading, data } = useQuery(["ticketsForSearchBar", debouncedInputValue], () => {
		return fetchEntity({
			route: "ticketsForSearchBar",
			queryParams: {
				title: inputValue,
			},
		});
	});

	useEffect(() => {
		window.addEventListener("keydown", (e) => {
			if (e.ctrlKey && e.key === "k") {
				e.preventDefault();
				inputRef.current!.click();
			}
		});
	}, []);

	const handleListItemClick = (e) => {
		(e.target as HTMLLIElement).querySelector("a")?.click();
	};

	return (
		<>
			<InputGroup
				ref={inputRef}
				onClick={onOpen}
				className={`${className} cursor-pointer`}
				{...props}
			>
				<InputLeftElement>
					<FontAwesomeIcon icon={faSearch} />
				</InputLeftElement>
				<Input className="cursor-pointer" type={"search"} placeholder="search for ticket" />
				<InputRightElement className="flex gap-2" width={"fit-content"} pr={"2"}>
					<Kbd>Ctrl</Kbd>+<Kbd>K</Kbd>
				</InputRightElement>
			</InputGroup>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent className="" maxHeight={"80vh"}>
					<Box className="p-4">
						<Box className="flex flex-row items-center gap-6 p-4">
							<FontAwesomeIcon icon={faSearch} />
							<Input
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
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
					{!isLoading && data.items.length === 0 && (
						<>
							<ListResultEmptyDisplay className="mx-auto list-none pt-2 pb-4" />
						</>
					)}
					{!isLoading && data.items.length > 0 && (
						<>
							<NavigatableList
								className="m-0 flex flex-col gap-2 overflow-y-scroll pl-4 pb-4 pr-4"
								listItems={data.items}
								listItemProps={{
									className: "list-none",
								}}
								onListItemClick={handleListItemClick}
							>
								{(listItem, isActive) => (
									<SearchBarListItem
										key={listItem.id}
										enableHoverColors
										isActive={isActive}
										title={listItem.title}
										description={listItem.responsibleUser?.username}
										href={`/Ticket/Details/${listItem.id}`}
										highlightQuery={inputValue}
									/>
								)}
							</NavigatableList>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export default SearchBar;
