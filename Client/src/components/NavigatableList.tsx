import { ComponentPropsWithRef, useRef } from 'react';
import useKeyPosition from 'src/hooks/useKeyPosition';

type _NavigatableListProps = {
    listItems: any[]
    children(listItem, isActive: boolean): React.ReactNode
    listItemProps?: ComponentPropsWithRef<"li">
    onListItemClick?(e: React.MouseEvent<HTMLLIElement, MouseEvent>): void
}

export type NavigatableListProps = _NavigatableListProps & Omit<ComponentPropsWithRef<'ul'>, keyof _NavigatableListProps>

function NavigatableList({ className, listItems, listItemProps, ...props }: NavigatableListProps) {

    const listRef = useRef<HTMLUListElement | null>(null);
    const [keyPosition, setKeyPosition] = useKeyPosition(listItems.length - 1, {
        events: {
            onArrowUp: (keyPosition) => {
                listRef.current!.querySelectorAll("li")[keyPosition].scrollIntoView({ behavior: "smooth" })
            },
            onArrowDown: (keyPosition) => {
                listRef.current!.querySelectorAll("li")[keyPosition].scrollIntoView({ behavior: "smooth" })
            },
            onEnter: (keyPosition) => {
                listRef.current!.querySelectorAll("li")[keyPosition].click();
            }
        }
    });

    return (
        <ul
            ref={listRef}
            className={`${className}`}
            {...props}>
            {listItems.map((listItem, index) => (
                <li
                    key={listItem.id}
                    onClick={e => { props.onListItemClick?.(e) }}
                    onMouseOver={() => setKeyPosition(index)}
                    {...listItemProps}>
                    {props.children(listItem, index === keyPosition)}
                </li>
            ))}
        </ul>
    );
}

export default NavigatableList;