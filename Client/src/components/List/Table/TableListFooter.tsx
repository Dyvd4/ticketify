import classNames from 'classnames';
import { ComponentPropsWithRef, PropsWithChildren } from 'react';
import { PagerSection } from '../../Pager';
import usePagingInfo from '../Result/hooks/usePagingInfo';

type _TableListFooterProps = {
    useFilter: boolean
    pagerSectionProps: {
        page: number
        setPage(page: number): void
        pagingInfo: ReturnType<typeof usePagingInfo>
        itemsPerPage: number
        setItemsPerPage(itemsPerPage: number): void
    }
}

export type TableListFooterProps = _TableListFooterProps &
    Omit<PropsWithChildren<ComponentPropsWithRef<'div'>>, keyof _TableListFooterProps>

function TableListFooter({ className, useFilter, pagerSectionProps, ...props }: TableListFooterProps) {

    const { page, pagingInfo, itemsPerPage, setItemsPerPage, setPage } = pagerSectionProps;

    return (
        <>
            <div className={classNames({
                "col-span-9 2xl:col-span-10": useFilter,
                "col-span-12": !useFilter,
            })}>
                {!!pagingInfo && <>
                    <PagerSection
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        pagerProps={{
                            onChange: setPage,
                            pagesCount: pagingInfo.pagesCount,
                            currentPage: page
                        }}
                    />
                </>}
            </div>
        </>
    );
}

export default TableListFooter;