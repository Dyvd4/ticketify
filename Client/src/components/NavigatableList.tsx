import { ComponentPropsWithRef, useRef } from "react";
import useKeyPosition from "src/hooks/useKeyPosition";
import autoAnimate from "@formkit/auto-animate";

type _NavigatableListProps = {
	listItems: any[];
	children(listItem, isActive: boolean): React.ReactNode;
	listItemProps?: ComponentPropsWithRef<"li">;
	onListItemClick?(e: React.MouseEvent<HTMLLIElement, MouseEvent>): void;
};

export type NavigatableListProps = _NavigatableListProps &
	Omit<ComponentPropsWithRef<"ul">, keyof _NavigatableListProps>;

function NavigatableList(props: NavigatableListProps) {
	const { className, listItems, listItemProps, onListItemClick, ...restProps } = props;

	const listRef = useRef<HTMLUListElement | null>(null);
	const [keyPosition, setKeyPosition] = useKeyPosition(listItems.length - 1, {
		events: {
			onArrowUp: (keyPosition) => {
				listRef
					.current!.querySelectorAll("li")
					[keyPosition].scrollIntoView({ behavior: "smooth" });
			},
			onArrowDown: (keyPosition) => {
				listRef
					.current!.querySelectorAll("li")
					[keyPosition].scrollIntoView({ behavior: "smooth" });
			},
			onEnter: (keyPosition) => {
				listRef.current!.querySelectorAll("li")[keyPosition].click();
			},
		},
	});

	const handleListRefChange = (ref) => {
		if (!ref) return;
		listRef.current = ref;
		autoAnimate(ref);
	};

	return (
		<ul ref={handleListRefChange} className={`${className}`} {...restProps}>
			{listItems.map((listItem, index) => (
				<li
					key={listItem.id}
					onClick={(e) => {
						onListItemClick?.(e);
					}}
					onMouseOver={() => setKeyPosition(index)}
					{...listItemProps}
				>
					{props.children(listItem, index === keyPosition)}
				</li>
			))}
		</ul>
	);
}

export default NavigatableList;
