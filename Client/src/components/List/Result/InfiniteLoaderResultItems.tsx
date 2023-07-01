import { Button, ButtonProps } from "@chakra-ui/react";
import { UseInfiniteQueryResult } from "react-query";
import useIntersectionObserver from "src/hooks/useIntersectionObserver";
import LoadingRipple from "../../Loading/LoadingRippleWithPositioning";
import ListResultErrorDisplay from "./ListResultErrorDisplay";
import ListResultItems, { ListResult } from "./ListResultItems";

export type InfiniteLoaderResult = {
	nextSkip: number;
} & ListResult;

type InfiniteLoaderResultItemsProps = {
	query: UseInfiniteQueryResult<InfiniteLoaderResult>;
	children(item: any): JSX.Element;
	loadingDisplay?: JSX.Element;
	errorDisplay?: JSX.Element;
	emptyDisplay?: JSX.Element;
	isLoading?: boolean;
} & (
	| {
			/**
			 * this option uses a `"load more"-button` that can be clicked in order to
			 * load more items
			 */
			variant: "load-more-button";
			loadMoreButtonProps?: Omit<ButtonProps, "onClick" | "isLoading">;
	  }
	| {
			/**
			 * this option uses an `IntersectionObserver` that observes the list-items and
			 * loads more items when they hit the viewport threshold
			 */
			variant: "intersection-observer";
	  }
);

export type Variant = InfiniteLoaderResultItemsProps["variant"];

/** expects a query with InfiniteLoaderResult */
function InfiniteLoaderResultItems({
	query,
	isLoading,
	variant,
	...props
}: InfiniteLoaderResultItemsProps) {
	const {
		isError,
		isLoading: queryIsLoading,
		data,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = query;

	useIntersectionObserver({
		selector: ".infinite-query-item",
		events: {
			lastItemIntersecting: () => {
				if (hasNextPage && variant === "intersection-observer") fetchNextPage();
			},
		},
	});

	if (queryIsLoading || isLoading) return props.loadingDisplay || <LoadingRipple />;

	if (isError) return props.errorDisplay || <ListResultErrorDisplay />;

	return (
		<>
			<ListResultItems
				variant={"infiniteLoading"}
				data={data}
				emptyDisplay={props.emptyDisplay}
			>
				{(item) => props.children(item)}
			</ListResultItems>
			{hasNextPage && variant === "load-more-button" && (
				<>
					<div className="infinite-query-item" key="random-key">
						<Button
							isLoading={isFetchingNextPage}
							onClick={() => fetchNextPage()}
							{...("loadMoreButtonProps" in props
								? props.loadMoreButtonProps
								: ({} as any))}
						>
							Load more
						</Button>
					</div>
				</>
			)}
		</>
	);
}

export { InfiniteLoaderResultItems };
