import { Skeleton } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import BgBox from "../BgBox";

type _KanbanBoardSkeletonProps = {};

export type KanbanBoardSkeletonProps = PropsWithChildren<_KanbanBoardSkeletonProps> &
    Omit<ComponentPropsWithRef<"ul">, keyof _KanbanBoardSkeletonProps>;

const kanbanGroups = [
    {
        name: "Category A",
        items: [
            { id: 1, title: "Item 1", description: "Description for Item 1" },
            { id: 3, title: "Item 3", description: "Description for Item 3" },
            { id: 2, title: "Item 2", description: "Description for Item 2" },
        ],
    },
    {
        name: "Category B",
        items: [
            { id: 6, title: "Item 6", description: "Description for Item 6" },
            { id: 5, title: "Item 5", description: "Description for Item 5" },
            { id: 4, title: "Item 4", description: "Description for Item 4" },
        ],
    },
    {
        name: "Category C",
        items: [
            { id: 7, title: "Item 7", description: "Description for Item 7" },
            { id: 9, title: "Item 9", description: "Description for Item 9" },
            { id: 8, title: "Item 8", description: "Description for Item 8" },
        ],
    },
];

function KanbanBoardSkeleton({ className, ...props }: KanbanBoardSkeletonProps) {
    return (
        <ul className={`${className} relative grid list-none grid-cols-3 gap-4 p-4`} {...props}>
            {kanbanGroups.map((group) => (
                <li key={group.name} className={"rounded-md"}>
                    <BgBox className="rounded-b-none border-b text-center">
                        <Skeleton className="rounded-md">{group.name}</Skeleton>
                    </BgBox>
                    <BgBox className={"relative rounded-t-none"}>
                        <ul className="flex list-none flex-col gap-4">
                            {group.items.map((item) => (
                                <li draggable key={item.id} className="cursor-pointer">
                                    <Skeleton className="rounded-md">
                                        <BgBox variant="child">{item.description}</BgBox>
                                    </Skeleton>
                                </li>
                            ))}
                        </ul>
                    </BgBox>
                </li>
            ))}
        </ul>
    );
}

export default KanbanBoardSkeleton;
