import { UseInfiniteQueryResult } from "react-query";
import useIntersectionObserver from "src/hooks/useIntersectionObserver";

type InfiniteLoadingResult = {
    type: "infiniteLoading"
    items: any
    nextSkip: number
}

type InfiniteQueryItemsProps = {
    query: UseInfiniteQueryResult<InfiniteLoadingResult>
    children(item: any): JSX.Element
    loadingDisplay?: JSX.Element
    errorDisplay?: JSX.Element
    fetchingNextDisplay?: JSX.Element
}

function InfiniteQueryItems({ query, ...props }: InfiniteQueryItemsProps) {

    const {
        isError,
        isLoading,
        isFetchingNextPage,
        data,
        hasNextPage,
        fetchNextPage
    } = query;

    useIntersectionObserver({
        selector: ".infinite-query-item",
        events: {
            lastItemIntersecting: () => {
                if (hasNextPage) fetchNextPage();
            }
        }
    });

    if (isLoading) return props.loadingDisplay || null;
    if (isError) return props.errorDisplay || null;

    return <>
        {data.pages.map(page => (
            page.items.map((item: any) => (
                <div className="infinite-query-item" key={item.id}>
                    {props.children(item)}
                </div>
            ))
        ))}
        {isFetchingNextPage && props.fetchingNextDisplay}
    </>
}

export default InfiniteQueryItems;