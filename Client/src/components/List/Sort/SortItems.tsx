import { CircularProgress } from "@chakra-ui/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { RefObject } from "react";
import { move } from "src/utils/array";
import SortItem, { SortItemType } from "./Private/SortItem";

export type DefaultSortItemType = Omit<SortItemType, "disabled" | "direction">;

type SortItemsProps = {
    items: SortItemType[]
    onChange(items)
}

function SortItems({ items, ...props }: SortItemsProps) {
    const [listRef] = useAutoAnimate();

    const handleSort = (direction: "up" | "down", name) => {
        const itemToChange = items.find(item => item.property === name)!
        const newItems = [...move(items, itemToChange, direction)];
        props.onChange(newItems);
    }

    const handleChange = (name, changedItem) => {
        const oldItem = items.find(item => item.property === name)!
        const spliceIndex = items.indexOf(oldItem);
        const newItems = [...items];
        newItems.splice(spliceIndex, 1, changedItem);
        props.onChange(newItems);
    }

    return items
        ? <div className="flex flex-col gap-2" ref={listRef as RefObject<HTMLDivElement>}>
            {items.map((item, index, self) => (
                <SortItem {...item}
                    onChange={handleChange}
                    onSortDown={(self.indexOf(item) === self.length - 1)
                        ? undefined
                        : (name) => { handleSort("down", name) }}
                    onSortUp={(self.indexOf(item) === 0)
                        ? undefined
                        : (name) => { handleSort("up", name) }}
                    key={item.property}
                />
            ))}
        </div>
        : <CircularProgress isIndeterminate />
}

export default SortItems;