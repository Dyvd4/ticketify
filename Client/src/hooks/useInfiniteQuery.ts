import { QueryKey, useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from "react-query";
import { fetchEntity, FetchEntityParams } from "src/api/entity";

const useCustomInfiniteQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    queryKey: TQueryKey,
    fetchEntityArgs: Omit<FetchEntityParams, "entityId">,
    options?: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseInfiniteQueryResult<TData, TError> => {
    return useInfiniteQuery(queryKey, ({ pageParam }) => {
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
export default useCustomInfiniteQuery;