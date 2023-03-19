import List from "./list";
import { InfiniteLoaderQueryDto } from "./list.dtos";
import { InfiniteLoaderResult } from "./result";

const ITEMS_PER_LOAD = 10;

class InfiniteLoader<T> extends List {

	constructor(
		prismaFilter: string,
		prismaOrderBy: string,
		skip: number,
		itemsPerLoad = ITEMS_PER_LOAD,
	) {
		const prismaArgs = {
			skip: skip || 0,
			take: itemsPerLoad
		};
		super(prismaFilter, prismaOrderBy, prismaArgs, itemsPerLoad);
	}

	getResult = (items: T[], itemsCount: number) => {
		return new InfiniteLoaderResult(
			items,
			itemsCount,
			this.prismaArgs,
			this.itemsPerLoad
		);
	}
}

// adapter for NestJs
export default class NestJsInfiniteLoader<T> extends InfiniteLoader<T> {
	constructor(queryDto: InfiniteLoaderQueryDto, itemsPerLoad = ITEMS_PER_LOAD) {
		super(queryDto.filter || "[]",
			queryDto.orderBy || "[]",
			queryDto.skip,
			itemsPerLoad
		);
	}
}