import { ComponentPropsWithRef, PropsWithChildren } from "react";

type _ListResultEmptyDisplayProps = {};

export type ListResultEmptyDisplayProps = PropsWithChildren<_ListResultEmptyDisplayProps> &
    Omit<ComponentPropsWithRef<"li">, keyof _ListResultEmptyDisplayProps>;

function ListResultEmptyDisplay({ className, ...props }: ListResultEmptyDisplayProps) {
    return (
        <li className={`${className}`} {...props}>
            This list seems to be empty 😴
        </li>
    );
}

export default ListResultEmptyDisplay;
