import { Box, Th } from "@chakra-ui/react";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAtom } from "jotai";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import sortItemsAtom from "../context/atoms/sortItemsAtom";
import { TSortItem } from "./SortItems";
import { getToggledColumn } from "./utils/sortColumns";

type _SortColumnsProps = {
	columns: TSortItem[];
};

export type SortColumnsProps = PropsWithChildren<_SortColumnsProps> &
	Omit<ComponentPropsWithRef<"th">, keyof _SortColumnsProps>;

function SortColumns({ className, columns, ...props }: SortColumnsProps) {
	const [items, setItems] = useAtom(sortItemsAtom);

	const handleColumnClick = (columnToChange: TSortItem) => {
		const oldItem = items.find((item) => item.property === columnToChange.property)!;
		const spliceIndex = items.indexOf(oldItem);
		const newItems = [...items];
		const column = getToggledColumn({ ...columnToChange });
		newItems.splice(spliceIndex, 1, column);
		setItems(newItems);
	};

	return (
		<>
			{items.map((column) => (
				<Th
					className={`${className} cursor-pointer select-none`}
					onClick={() => handleColumnClick(column)}
					key={column.property}
					{...props}
				>
					<Box className="flex items-center gap-2">
						<span>{column.label}</span>
						{!column.disabled && (
							<>
								{column.direction!.value === "asc" && (
									<>
										<FontAwesomeIcon icon={faCaretUp} />
									</>
								)}
								{column.direction!.value === "desc" && (
									<>
										<FontAwesomeIcon icon={faCaretDown} />
									</>
								)}
							</>
						)}
					</Box>
				</Th>
			))}
		</>
	);
}

export default SortColumns;
