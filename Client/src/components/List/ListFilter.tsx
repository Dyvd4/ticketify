import { Button } from '@chakra-ui/react';
import { ComponentPropsWithRef, PropsWithChildren } from 'react';
import FilterItems from './Filter/FilterItems';

type _ListFilterProps = {
    onFilterApply(...args: any[]): void
    onFilterReset(...args: any[]): void
}

export type ListFilterProps = _ListFilterProps &
    Omit<PropsWithChildren<ComponentPropsWithRef<'div'>>, keyof _ListFilterProps>

function ListFilter({ className, onFilterReset, onFilterApply, ...props }: ListFilterProps) {
    return (
        <div className="border rounded-md p-4 flex justify-between flex-col gap-4" {...props}>
            <FilterItems />
            <div className='flex flex-col gap-2'>
                <Button
                    onClick={onFilterReset}
                    variant="outline"
                    mr={3}>
                    reset
                </Button>
                <Button
                    onClick={onFilterApply}
                    colorScheme="blue"
                    mr={3}>
                    apply
                </Button>
            </div>
        </div>
    );
}

export default ListFilter;