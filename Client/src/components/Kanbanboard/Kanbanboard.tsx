
import autoAnimate from "@formkit/auto-animate";
import { ComponentPropsWithRef, useState } from 'react';
import BgBox from '../BgBox';
import { ListResultEmptyDisplay } from "../List/Result";

type _KanbanboardProps<T extends { id: any }> = {
	groups: Array<{
		name: string // provide id instead of unique name?
		items: Array<T>
	}>
	setGroups(groups: _KanbanboardProps<T>["groups"]): void
	groupItemsRenderer(item: T): React.ReactNode
	/**
	 * Only triggered when successfully dropped item
	 * @param item
	 * the dropped item
	 */
	onDrop?(item: T): void
}

export type KanbanboardProps<T extends { id: any }> = _KanbanboardProps<T> &
	Omit<ComponentPropsWithRef<'ul'>, keyof _KanbanboardProps<T>>

function Kanbanboard<T extends { id: any }>({ className, groups, groupItemsRenderer, setGroups, onDrop, ...props }: KanbanboardProps<T>) {

	const [draggedOverGroupName, setDraggedOverGroupName] = useState<string | undefined>();

	const handleDragStart = (e: React.DragEvent<HTMLLIElement>, groupItem: T) => {
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.setData("GroupItemToMove", JSON.stringify(groupItem));
	}

	const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
		setDraggedOverGroupName(undefined)
	}

	const handleOnDragEnter = (e: React.DragEvent<HTMLLIElement>, groupName: string) => {
		e.preventDefault();
		setDraggedOverGroupName(groupName)
	}

	const handleOnDragOver = (e: React.DragEvent<HTMLLIElement>, groupName: string) => {
		e.preventDefault()
	}

	const handleOnDrop = (e: React.DragEvent<HTMLLIElement>, groupName: string) => {

		const droppedGroupItem = JSON.parse(e.dataTransfer.getData("GroupItemToMove")) as T;
		const groupsCopy = [...groups];

		let droppedGroupItemGroupIndex: number | undefined;
		let droppedGroupItemIndex: number | undefined;

		for (let i = 0; i < groupsCopy.length; i++) {
			const itemIndex = groupsCopy[i].items.findIndex(item => item.id === droppedGroupItem.id);
			if (itemIndex !== -1) {
				droppedGroupItemGroupIndex = i;
				droppedGroupItemIndex = itemIndex;
				break;
			}
		}

		if (droppedGroupItemGroupIndex !== undefined && droppedGroupItemIndex !== undefined) {
			const groupItemsCopy = [...groupsCopy[droppedGroupItemGroupIndex].items];
			groupItemsCopy.splice(droppedGroupItemIndex, 1);

			groupsCopy.splice(droppedGroupItemGroupIndex, 1, {
				...groupsCopy[droppedGroupItemGroupIndex],
				items: groupItemsCopy
			});

			groupsCopy[groupsCopy.findIndex(group => group.name === groupName)].items.push(droppedGroupItem)
			setGroups(groupsCopy);
			onDrop?.(droppedGroupItem)
		}

		setDraggedOverGroupName(undefined)
	}

	return (
		<ul
			className={`${className} flex flex-wrap gap-4 list-none`}
			{...props}>
			{groups.map(group => (
				<li
					onDrop={(e) => handleOnDrop(e, group.name)}
					onDragEnter={e => handleOnDragEnter(e, group.name)}
					onDragOver={e => handleOnDragOver(e, group.name)}
					key={group.name}
					className={`${draggedOverGroupName === group.name
						? "border-2 border-cyan-500 border-dashed rounded-md transform "
						: ""} transition-all flex-1`}>
					<BgBox className="rounded-b-none border-b text-center">
						{group.name}
					</BgBox>
					<BgBox className="rounded-t-none">
						<ul
							ref={(listRef) => listRef && autoAnimate(listRef)}
							className='list-none flex flex-col gap-4'>
							{group.items.map(item => (
								<li
									draggable
									key={item.id}
									onDragStart={(e) => handleDragStart(e, item)}
									onDragEnd={handleDragEnd}
									className="cursor-pointer">
									<BgBox variant="child">
										{groupItemsRenderer(item)}
									</BgBox>
								</li>
							))}
							{group.items.length === 0 && <>
								<ListResultEmptyDisplay className="text-center" />
							</>}
						</ul>
					</BgBox>
				</li>
			))}
		</ul>
	);
}

export default Kanbanboard;