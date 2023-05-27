import { Skeleton, Td, Tr } from "@chakra-ui/react";
import { ComponentPropsWithRef, PropsWithChildren } from "react";

type _TableListItemSkeletonProps = {
    columnCount: number;
};

export type TableListItemSkeletonProps = _TableListItemSkeletonProps &
    Omit<PropsWithChildren<ComponentPropsWithRef<"tr">>, keyof _TableListItemSkeletonProps>;

function TableListItemSkeleton({ className, columnCount, ...props }: TableListItemSkeletonProps) {
    return (
        <Tr className={`${className}`} {...props}>
            {new Array(columnCount).fill(null).map((e, i) => (
                <Td key={i}>
                    <Skeleton height={"20px"} className="rounded-md" />
                </Td>
            ))}
        </Tr>
    );
}

export default TableListItemSkeleton;
