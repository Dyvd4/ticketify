import {
	Button,
	Menu,
	MenuButtonProps,
	MenuItemOption,
	MenuList,
	MenuOptionGroup,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
} from "@chakra-ui/react";
import { useState } from "react";
import { UseMutationResult } from "react-query";
import { cn } from "src/utils/component";
import MenuButton from "../Wrapper/MenuButton";

type _TagConfirmMenuProps<T> = {
	selectedMenuItem: T;
	menuItems: T[];
	mutation: UseMutationResult<any, any, any, any>;
	confirmDialogBodyRenderer(selectedItem: T, newSelectedItem: T): React.ReactNode;
	modalIsOpen: boolean;
	onModalOpen(): void;
	onModalClose(): void;
};

type EntityWithColor = { id: string; color: string; name: string };
export type TagConfirmMenuProps<T> = _TagConfirmMenuProps<T> &
	Omit<MenuButtonProps, keyof _TagConfirmMenuProps<T>>;

function TagConfirmMenu<T extends EntityWithColor>({
	className,
	menuItems,
	selectedMenuItem,
	confirmDialogBodyRenderer,
	onModalOpen,
	onModalClose,
	modalIsOpen,
	mutation,
	...props
}: TagConfirmMenuProps<T>) {
	const [newSelectedItem, setNewSelectedItem] = useState<any>(null);

	const handleOnChange = (newSelectedItemId: string) => {
		setNewSelectedItem(menuItems.find((i) => i.id === newSelectedItemId));
		onModalOpen();
	};

	const handleOnClose = () => {
		setNewSelectedItem(null);
		onModalClose();
	};

	return (
		<>
			<Modal isOpen={modalIsOpen} onClose={handleOnClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Are you sure?</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{modalIsOpen &&
							newSelectedItem &&
							confirmDialogBodyRenderer(selectedMenuItem, newSelectedItem)}
					</ModalBody>
					<ModalFooter>
						<Button
							isLoading={mutation.isLoading}
							mr={3}
							colorScheme={"blue"}
							onClick={() => mutation.mutate(newSelectedItem)}
						>
							confirm
						</Button>
						<Button onClick={handleOnClose}>cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Menu>
				<MenuButton
					height={"6"}
					className={cn("cursor-pointer", className)}
					as={Tag}
					// @ts-ignore
					colorScheme={selectedMenuItem.color}
					{...props}
				>
					{selectedMenuItem.name}
				</MenuButton>
				<MenuList>
					<MenuOptionGroup
						onChange={(value) => handleOnChange(value as string)}
						value={selectedMenuItem.id}
						type="radio"
					>
						{menuItems.map((item) => (
							<MenuItemOption key={item.id} value={item.id}>
								<Tag colorScheme={item.color}>{item.name}</Tag>
							</MenuItemOption>
						))}
					</MenuOptionGroup>
				</MenuList>
			</Menu>
		</>
	);
}

export default TagConfirmMenu;
