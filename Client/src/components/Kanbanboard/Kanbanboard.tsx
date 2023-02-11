
import autoAnimate from "@formkit/auto-animate";
import classNames from "classnames";
import { ComponentPropsWithRef, useEffect, useState } from 'react';
import BgBox from '../BgBox';
import { ListResultEmptyDisplay } from "../List/Result";

type CompareFn<T> = Parameters<Array<T>["sort"]>[0]

type _KanbanboardProps<T extends { id: any }> = {
	groups: Array<{
		/** a unique name for the group */
		name: string
		items: Array<T>
	}>
	setGroups(groups: _KanbanboardProps<T>["groups"]): void
	groupItemsRenderer(item: T): React.ReactNode
	/** 
	 * returns `true` of item can be dropped, 
	 * `false` if dropping should be aborted 
	 */
	onBeforeDrop?(item: T): Promise<boolean>
	/**
	 * Only triggered when successfully dropped item
	 * @param item
	 * the dropped item
	 */
	onDrop?(item: T): void
	/**
	 * Triggered initially and before setting state
	 */
	orderByEvaluator?: CompareFn<T>
	isLoading?: boolean
}

export type KanbanboardProps<T extends { id: any }> = _KanbanboardProps<T> &
	Omit<ComponentPropsWithRef<'ul'>, keyof _KanbanboardProps<T>>

function Kanbanboard<T extends { id: any }>({
	className,
	groups,
	groupItemsRenderer,
	setGroups,
	onDrop,
	onBeforeDrop,
	orderByEvaluator,
	isLoading,
	...props }: KanbanboardProps<T>) {

	// state
	// -----
	const [recentDraggedOverGroupName, setRecentDraggedOverGroupName] = useState<string | undefined>();
	const [isDragging, setIsDragging] = useState(false);

	// useEffect
	// ---------
	useEffect(() => {
		if (typeof orderByEvaluator === "function") setGroups(getSortedGroups(groups));
	}, [])

	// utils
	// -----
	const getSortedGroups = (groups: _KanbanboardProps<T>["groups"]): _KanbanboardProps<T>["groups"] => {
		return groups.map(group => {
			return {
				...group,
				items: [...group.items].sort(orderByEvaluator)
			}
		});
	}

	// Event handler
	// -------------
	const handleDragStart = (e: React.DragEvent<HTMLLIElement>, groupItem: T) => {
		e.dataTransfer.effectAllowed = "move"
		e.dataTransfer.setData("GroupItemToMove", JSON.stringify(groupItem));
	}

	const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
		setIsDragging(false)
	}

	const handleOnDragEnter = (e: React.DragEvent<HTMLLIElement>, groupName: string) => {
		e.preventDefault();
		setRecentDraggedOverGroupName(groupName);
		setIsDragging(true)
	}

	const handleOnDragOver = (e: React.DragEvent<HTMLLIElement>, groupName: string) => {
		e.preventDefault()
	}

	const handleOnDrop = async (e: React.DragEvent<HTMLLIElement>, groupName: string) => {

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

			if (typeof onBeforeDrop === "function") {
				const response = await onBeforeDrop?.(droppedGroupItem);
				if (!response) return;
			}

			const groupItemsCopy = [...groupsCopy[droppedGroupItemGroupIndex].items];
			groupItemsCopy.splice(droppedGroupItemIndex, 1);

			groupsCopy.splice(droppedGroupItemGroupIndex, 1, {
				...groupsCopy[droppedGroupItemGroupIndex],
				items: groupItemsCopy
			});

			groupsCopy[groupsCopy.findIndex(group => group.name === groupName)].items.push(droppedGroupItem)

			setGroups(getSortedGroups(groupsCopy));
			onDrop?.(droppedGroupItem)

		}

		setIsDragging(false);
	}

	return (
		<ul
			className={`${className} flex flex-wrap gap-4 list-none relative p-4`}
			{...props}>
			{groups.map(group => (
				<li
					onDrop={(e) => handleOnDrop(e, group.name)}
					onDragEnter={e => handleOnDragEnter(e, group.name)}
					onDragOver={e => handleOnDragOver(e, group.name)}
					key={group.name}
					className={classNames("transform transition-all flex-1 border-cyan-500 rounded-md", {
						"border-2 border-cyan-500 border-dashed": recentDraggedOverGroupName === group.name && isDragging,
						"border-2 ": recentDraggedOverGroupName === group.name && isLoading, // TODO: fancy border animation
					})}>
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