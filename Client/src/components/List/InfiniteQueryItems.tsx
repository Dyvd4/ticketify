import { Alert, AlertIcon, Text } from "@chakra-ui/react";
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
    fetchingNextDisplay?: JSX.Element
}

function InfiniteQueryItems({ query, ...props }: InfiniteQueryItemsProps) {

    const {
        isError,
        isLoading,
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
    </>
}

export default InfiniteQueryItems;