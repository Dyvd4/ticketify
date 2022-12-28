import { Alert, AlertIcon, Button, ButtonProps, Text } from "@chakra-ui/react";
import { UseInfiniteQueryResult } from "react-query";
import useIntersectionObserver from "src/hooks/useIntersectionObserver";
import LoadingRipple from "../Loading/LoadingRipple";

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
    emptyDisplay?: JSX.Element
} & ({
    /** 
     * this option uses a `"load more"-button` that can be clicked in order to
     * load more items
     */
    variant: "load-more-button"
    loadMoreButtonProps?: Omit<ButtonProps, "onClick" | "isLoading">

} | {
    /** 
     * this option uses an `IntersectionObserver` that observes the list-items and
     * loads more items when they hit the viewport threshold
     */
    variant: "intersection-observer"
})

export type Variant = InfiniteQueryItemsProps["variant"]

function InfiniteQueryItems({ query, variant = "intersection-observer", ...props }: InfiniteQueryItemsProps) {

    const {
        isError,
        isLoading,
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    } = query;

    useIntersectionObserver({
        selector: ".infinite-query-item",
        events: {
            lastItemIntersecting: () => {
                if (hasNextPage && variant === "intersection-observer") fetchNextPage();
            }
        }
    });

    if (isLoading) return props.loadingDisplay || <LoadingRipple centered />;

    if (isError) {
        return props.errorDisplay ||
            <Alert className="rounded-md" status="error" variant="top-accent">
                <AlertIcon />
                <Text>
                    There was an error processing your request
                </Text>
            </Alert>;
    }

    return <>
        {data.pages.map(page => (
            page.items.length > 0
                ? page.items.map((item: any) => (
                    <div className="infinite-query-item" key={item.id}>
                        {props.children(item)}
                    </div>
                ))
                : props.emptyDisplay || <div>This list seems to be empty 😴</div>
        ))}
        {hasNextPage && variant === "load-more-button" && <>
            <div className="infinite-query-item" key="random-key">
                <Button
                    isLoading={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    {...("loadMoreButtonProps" in props ? props.loadMoreButtonProps : {} as any)}>
                    Load more
                </Button>
            </div>
        </>}
    </>
}

export default InfiniteQueryItems;