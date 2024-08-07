import List, { FilterQueryParams, OrderByQueryParams } from "./list";
import { InfiniteLoaderQueryDto } from "./list.dtos";
import { InfiniteLoaderResult } from "./result";

const ITEMS_PER_LOAD = 10;

class InfiniteLoader<T> extends List {
	constructor(
		prismaFilter: FilterQueryParams,
		prismaOrderBy: OrderByQueryParams,
		skip: number,
		itemsPerLoad = ITEMS_PER_LOAD
	) {
		const prismaArgs = {
			skip,
			take: itemsPerLoad,
		};
		super(prismaFilter, prismaOrderBy, prismaArgs, itemsPerLoad);
	}

	getResult = (items: T[], itemsCount: number) => {
		return new InfiniteLoaderResult(items, itemsCount, this.prismaArgs, this.itemsPerLoad);
	};
}

// adapter for NestJs
export default class NestJsInfiniteLoader<T> extends InfiniteLoader<T> {
	constructor(queryDto: InfiniteLoaderQueryDto, itemsPerLoad = ITEMS_PER_LOAD) {
		super(queryDto.filter || [], queryDto.orderBy || [], queryDto.skip, itemsPerLoad);
	}
}
