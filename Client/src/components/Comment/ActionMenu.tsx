import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { faEdit, faEllipsisVertical, faRemove } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import IconButton from "src/components/Wrapper/IconButton";

type ActionMenuProps = {
	active?: boolean;
	onEdit?(...args): void;
	onDelete?(...args): void;
};

function ActionMenu({ active, ...props }: ActionMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Menu onClose={() => setIsOpen(false)} onOpen={() => setIsOpen(true)}>
			{(props.onEdit || props.onDelete) && (
				<>
					<MenuButton
						as="div"
						className={`${
							active || isOpen
								? "absolute top-0 right-0 block cursor-pointer"
								: "hidden"
						}`}
					>
						<IconButton
							circle
							size={"xs"}
							aria-label="actions"
							icon={<FontAwesomeIcon icon={faEllipsisVertical} />}
						/>
					</MenuButton>
				</>
			)}
			<MenuList className={`${active || isOpen ? "block" : "hidden"}`}>
				{props.onEdit && (
					<>
						<MenuItem onClick={props.onEdit} icon={<FontAwesomeIcon icon={faEdit} />}>
							Edit
						</MenuItem>
					</>
				)}
				{props.onDelete && (
					<>
						<MenuItem
							color="red"
							onClick={props.onDelete}
							icon={<FontAwesomeIcon icon={faRemove} />}
						>
							Delete
						</MenuItem>
					</>
				)}
			</MenuList>
		</Menu>
	);
}

export default ActionMenu;
