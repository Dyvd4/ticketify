import { QueryKey, useInfiniteQuery as reactQueryUseInfiniteQuery, useQuery as reactQueryUseQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult, UseQueryOptions, UseQueryResult } from "react-query";
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
                skip: pageParam || 0
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

export const useQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    queryKey: TQueryKey,
    fetchEntityArgs: FetchEntityArgs,
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> => {
    return reactQueryUseQuery(queryKey, () => {
        return fetchEntity(fetchEntityArgs);
    }, options);
}