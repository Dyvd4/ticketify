import { CircularProgress } from "@chakra-ui/react";
import { useAtom } from "jotai";
import filterItemsAtom from "src/components/List/context/atoms/filterItemsAtom";
import FilterItem from "./FilterItem";

type FilterItemsProps = {};

function FilterItems(props: FilterItemsProps) {
	const [items, setItems] = useAtom(filterItemsAtom);

	const handleChange = (name, changedItem) => {
		if (!items) return;
		const newItems = [...items];
		const itemToChange = newItems.find((item) => item.property === name)!;
		const spliceIndex = newItems.indexOf(itemToChange);
		newItems.splice(spliceIndex, 1, changedItem);
		setItems(newItems);
	};

	return items ? (
		<div className="flex flex-col gap-2">
			{items.map((item, index, self) => (
				<FilterItem {...item} onChange={handleChange} key={item.property} />
			))}
		</div>
	) : (
		<div className="flex h-full items-center justify-center">
			<CircularProgress isIndeterminate />
		</div>
	);
}

export default FilterItems;
