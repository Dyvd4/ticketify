import { QueryKey, useInfiniteQuery as reactQueryUseInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";
import { fetchEntity, FetchEntityArgs } from "src/api/entity";

export const useInfiniteQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    queryKey: TQueryKey,
    fetchEntityArgs: Omit<FetchEntityArgs, "entityId">,
    options?: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseInfiniteQueryResult<TData, TError> => {
    return reactQueryUseInfiniteQuery(queryKey, ({ pageParam }) => {
        return fetchEntity({
            ...fetchEntityArgs,
            queryParams: {
                ...fetchEntityArgs.queryParams,
                skip: pageParam
            }
        });
    }, {
        getNextPageParam: (lastPage: any) => lastPage.nextSkip,
        ...options
    });
}

export const useInfiniteQueryCount = (infiniteQuery: UseInfiniteQueryResult): number => {
    return !infiniteQuery.data
        ? 0
        : (infiniteQuery.data.pages as any).reduce((pageCount, nextPage) => {
            pageCount += nextPage.items.length;
            return pageCount;
        }, 0)
}