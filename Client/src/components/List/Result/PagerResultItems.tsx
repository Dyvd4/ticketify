import LoadingRipple from "components/Loading/LoadingRipple";
import { PagerSection } from "components/Pager";
import { useEffect } from "react";
import { UseQueryResult } from "react-query";
import usePagingInfo from "./hooks/usePagingInfo";
import ListResultErrorDisplay from "./ListResultErrorDisplay";
import ListResultItems, { ListResult } from "./ListResultItems";

export type PagerResult = {
    prevPage: number
    nextPage: number
    pagesCount: number
    pagesCountShrunk: boolean
    pageIsFull: boolean
} & ListResult

type PageQueryItemsProps = {
    query: UseQueryResult<PagerResult>
    page: number
    setPage(page: number): void
    itemsPerPage: number
    setItemsPerPage(itemsPerPage: number): void
    children(item: any): JSX.Element
    loadingDisplay?: JSX.Element
    errorDisplay?: JSX.Element
    emptyDisplay?: JSX.Element
    isLoading?: boolean
}

function PagerResultItems({ query, isLoading, ...props }: PageQueryItemsProps) {

    const {
        isError,
        isLoading: queryIsLoading,
        data,
    } = query;

    if (queryIsLoading || isLoading) return props.loadingDisplay || <LoadingRipple centered />;

    if (isError) return props.errorDisplay || <ListResultErrorDisplay />

    const pagingInfo = usePagingInfo(query)!;

    useEffect(() => {
        if (pagingInfo.pagesCountShrunk) {
            props.setPage(pagingInfo.nextPage); // nearest possible page
        }
    }, [pagingInfo.pagesCountShrunk]);

    return <>
        <ListResultItems
            variant={"pagination"}
            data={data}
            emptyDisplay={props.emptyDisplay}>
            {item => props.children(item)}
        </ListResultItems>
        <PagerSection
            itemsPerPage={props.itemsPerPage}
            setItemsPerPage={props.setItemsPerPage}
            pagerProps={{
                centered: true,
                onChange: props.setPage,
                pagesCount: pagingInfo.pagesCount,
                currentPage: props.page
            }}
        />
    </>
}

export { PagerResultItems };

