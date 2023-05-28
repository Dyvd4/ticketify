import { UseQueryResult } from "react-query";
import { PagerResult } from "../PagerResultItems";

const usePagingInfo = (query: UseQueryResult<PagerResult>) => {
	if (query.isLoading || query.isError) return null;

	const pagingInfo = {
		pagesCount: query.data.pagesCount,
		pagesCountShrunk: query.data.pagesCountShrunk,
		prevPage: query.data.prevPage,
		nextPage: query.data.nextPage,
		currentPage: query.data.nextPage - 1,
	};

	return pagingInfo;
};

export default usePagingInfo;
