import { List as ChakraList } from "@chakra-ui/react";
import autoAnimate from "@formkit/auto-animate";
import classNames from "classnames";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { UseInfiniteQueryResult, UseQueryResult } from "react-query";
import LoadingRipple from "../Loading/LoadingRipple";
import ListFilter from "./ListFilter";
import { InfiniteLoaderResultItems, PagerResultItems } from "./Result";
import { InfiniteLoaderResult } from "./Result/InfiniteLoaderResultItems";
import { ListResultVariant } from "./Result/ListResultItems";
import { PagerResult } from "./Result/PagerResultItems";

type _ListBodyProps = {
    useFilter: boolean;
    filterProps: {
        onFilterApply(...args: any[]): void;
        onFilterReset(...args: any[]): void;
    };
    listProps: {
        page: number;
        setPage(page: number): void;
        itemsPerPage: number;
        setItemsPerPage(itemsPerPage: number): void;
        listItemRender(listItem): React.ReactElement;
        paginationQuery: UseQueryResult<PagerResult, unknown>;
        infiniteLoadingQuery: UseInfiniteQueryResult<InfiniteLoaderResult, unknown>;
        loadingDisplay?: JSX.Element;
    };
    variant: ListResultVariant;
};

export type ListBodyProps = _ListBodyProps &
    Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _ListBodyProps>;

function ListBody({ className, useFilter, ...props }: ListBodyProps) {
    const { listProps, filterProps, variant } = props;

    const infiniteLoaderResultVariantName =
        variant.name === "infiniteLoading" ? variant.variant.name : "intersection-observer";

    return (
        <>
            <div
                className={classNames({
                    "col-span-9 2xl:col-span-10": useFilter,
                    "col-span-12": !useFilter,
                })}
            >
                <ChakraList
                    className="flex flex-col gap-4"
                    ref={(listRef) => listRef && autoAnimate(listRef)}
                >
                    {variant.name === "pagination" && (
                        <>
                            <PagerResultItems
                                itemsPerPage={listProps.itemsPerPage}
                                setItemsPerPage={listProps.setItemsPerPage}
                                page={listProps.page}
                                setPage={listProps.setPage}
                                query={listProps.paginationQuery}
                                loadingDisplay={
                                    listProps.loadingDisplay || (
                                        <div className="flex items-center justify-center">
                                            <LoadingRipple />
                                        </div>
                                    )
                                }
                            >
                                {(listItem) => listProps.listItemRender(listItem)}
                            </PagerResultItems>
                        </>
                    )}
                    {variant.name === "infiniteLoading" && (
                        <>
                            <InfiniteLoaderResultItems
                                variant={infiniteLoaderResultVariantName}
                                loadMoreButtonProps={{
                                    className: "mx-auto flex",
                                }}
                                query={listProps.infiniteLoadingQuery}
                                loadingDisplay={
                                    listProps.loadingDisplay || (
                                        <div className="flex items-center justify-center">
                                            <LoadingRipple />
                                        </div>
                                    )
                                }
                            >
                                {(listItem) => listProps.listItemRender(listItem)}
                            </InfiniteLoaderResultItems>
                        </>
                    )}
                </ChakraList>
            </div>
            {useFilter && (
                <>
                    <div className={"col-span-3 ml-6 2xl:col-span-2"}>
                        <ListFilter
                            onFilterApply={filterProps.onFilterApply}
                            onFilterReset={filterProps.onFilterReset}
                        />
                    </div>
                </>
            )}
        </>
    );
}

export default ListBody;
