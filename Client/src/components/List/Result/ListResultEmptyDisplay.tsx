import { ComponentPropsWithRef, PropsWithChildren } from 'react';

type _ListResultEmptyDisplayProps = {}

export type ListResultEmptyDisplayProps = PropsWithChildren<_ListResultEmptyDisplayProps> &
    Omit<ComponentPropsWithRef<'div'>, keyof _ListResultEmptyDisplayProps>

function ListResultEmptyDisplay({ className, ...props }: ListResultEmptyDisplayProps) {
    return (
        <div
            className={`${className}`}
            {...props}>
            This list seems to be empty 😴
        </div>
    );
}

export default ListResultEmptyDisplay;