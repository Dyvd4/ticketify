import { Divider } from "@chakra-ui/react";
import LoadingRipple from "components/Loading/LoadingRipple";
import Pager from "components/Pager";
import { UseQueryResult } from "react-query";
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
    setPage(...args: any[]): void
    children(item: any): JSX.Element
    loadingDisplay?: JSX.Element
    errorDisplay?: JSX.Element
    emptyDisplay?: JSX.Element
}

function PagerResultItems({ query, page, ...props }: PageQueryItemsProps) {

    const {
        isError,
        isLoading,
        data,
    } = query;

    if (isLoading) return props.loadingDisplay || <LoadingRipple centered />;

    if (isError) return props.errorDisplay || <ListResultErrorDisplay />

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber === page) return;
        props.setPage(pageNumber)
    }

    const pagingResult = query.data.items.length > 0
        ? query.data.items[0]
        : null;

    const pagingInfo = {
        pagesCount: pagingResult?.pagesCount || 0,
        pagesCountShrunk: pagingResult?.pagesCountShrunk || false,
        prevPage: pagingResult?.prevPage || 0,
        nextPage: pagingResult?.nextPage || 0,
        currentPage: pagingResult?.nextPage && pagingResult.nextPage > 0
            ? pagingResult.nextPage - 1
            : 0
    }

    return <>
        <ListResultItems
            variant={"pagination"}
            data={data}
            emptyDisplay={props.emptyDisplay}>
            {item => props.children(item)}
        </ListResultItems>
        <Divider />
        <Pager
            centered
            onChange={handlePageChange}
            pagesCount={pagingInfo.pagesCount} // server state
            currentPage={page} // client state
        />
    </>
}

export { PagerResultItems };

