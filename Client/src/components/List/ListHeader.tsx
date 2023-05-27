import { Heading, IconButton, Input, Tooltip } from '@chakra-ui/react';
import { faAdd, faFilter, faSort } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAtom } from 'jotai';
import { ComponentPropsWithRef, PropsWithChildren } from 'react';
import searchItemAtom from 'src/components/List/context/atoms/searchItemAtom';
import { filterDrawerAtom, sortDrawerAtom } from 'src/context/atoms';

type _TableListHeaderProps = {
    title?: string
    count: number
    showCount?: boolean
    useSort: boolean
    useFilter: boolean
    useSearch: boolean
    onAdd?(...args: any[]): void
}

export type TableListHeaderProps = PropsWithChildren<_TableListHeaderProps> &
    Omit<ComponentPropsWithRef<'div'>, keyof _TableListHeaderProps>

function TableListHeader(props: TableListHeaderProps) {

    const {
        title,
        count,
        showCount,
        useFilter,
        useSearch,
        useSort,
        className,
        onAdd,
        ...restProps
    } = props;

    const [, setSortDrawer] = useAtom(sortDrawerAtom);
    const [, setFilterDrawer] = useAtom(filterDrawerAtom);
    const [searchItem, setSearchItem] = useAtom(searchItemAtom);

    return (
        <div
            className={`${className} flex justify-between my-4`}
            {...restProps}>
            <Heading>
                <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl whitespace-nowrap">
                    {showCount && <>
                        <div>
                            ({count})
                        </div>
                    </>}
                    {title && <>
                        <div>
                            {title}
                        </div>
                    </>}
                    {!!useSearch && <>
                        <Input
                            className='rounded-md'
                            size={"sm"}
                            placeholder={searchItem!.label}
                            onChange={(e) => setSearchItem({ ...searchItem!, value: e.target.value })}
                            value={searchItem!.value}
                            type={"search"}
                        />
                    </>}
                </div>
            </Heading>
            <div className='flex items-center gap-4'>
                {!!useSort && <>
                    <Tooltip
                        label="sort"
                        placement="top"
                        aria-label="sort">
                        <span className="flex justify-center items-center">
                            <IconButton
                                data-testid="ListHeader-sort-button"
                                size={"sm"}
                                onClick={() => setSortDrawer(true)}
                                aria-label="sort"
                                icon={<FontAwesomeIcon icon={faSort} />}
                            />
                        </span>
                    </Tooltip>
                </>}
                {!!useFilter && <>
                    <Tooltip
                        label="filter"
                        placement="top"
                        aria-label="filter">
                        <span className="flex justify-center items-center">
                            <IconButton
                                data-testid="ListHeader-filter-button"
                                size={"sm"}
                                onClick={() => setFilterDrawer(true)}
                                aria-label="filter"
                                icon={<FontAwesomeIcon icon={faFilter} />}
                            />
                        </span>
                    </Tooltip>
                </>}
                {!!onAdd && <>
                    <Tooltip
                        label="add"
                        placement="top"
                        aria-label="add">
                        <span className="flex justify-center items-center">
                            <IconButton
                                colorScheme={"cyan"}
                                size={"sm"}
                                onClick={onAdd}
                                aria-label="add"
                                icon={<FontAwesomeIcon icon={faAdd} />}
                            />
                        </span>
                    </Tooltip>
                </>}
            </div>
        </div>
    );
}

export default TableListHeader;