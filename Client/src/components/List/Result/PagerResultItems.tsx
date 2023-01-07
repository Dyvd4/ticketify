import { Divider } from "@chakra-ui/react";
import LoadingRipple from "components/Loading/LoadingRipple";
import Pager from "components/Pager";
import { useEffect } from "react";
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

function PagerResultItems({ query, ...props }: PageQueryItemsProps) {

    const {
        isError,
        isLoading,
        data,
    } = query;

    if (isLoading) return props.loadingDisplay || <LoadingRipple centered />;

    if (isError) return props.errorDisplay || <ListResultErrorDisplay />


    const handlePageChange = (pageNumber: number) => {
        if (pageNumber === props.page) return;
        props.setPage(pageNumber)
    }

    const pagingInfo = {
        pagesCount: query.data.pagesCount,
        pagesCountShrunk: query.data.pagesCountShrunk,
        prevPage: query.data.prevPage,
        nextPage: query.data.nextPage,
        currentPage: query.data.nextPage - 1
    }

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
        <Divider />
        <Pager
            centered
            onChange={handlePageChange}
            pagesCount={pagingInfo.pagesCount}
            currentPage={props.page}
        />
    </>
}

export { PagerResultItems };

