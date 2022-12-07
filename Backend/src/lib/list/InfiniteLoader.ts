import { Request } from "express";
import List from "./List";
import { InfiniteLoadingResult } from "./result";

const ITEMS_PER_LOAD = 10;

class InfiniteLoader<T> extends List {

    constructor(
        prismaFilter: string,
        prismaOrderBy: string,
        skip: number,
        itemsPerLoad = ITEMS_PER_LOAD
    ) {
        const prismaArgs = {
            skip: skip || 0,
            take: itemsPerLoad
        };
        super(prismaFilter, prismaOrderBy, prismaArgs, itemsPerLoad);
    }

    getResult = (items: T[], itemsCount: number) => {
        return new InfiniteLoadingResult(items, itemsCount, this.prismaArgs, this.itemsPerLoad);
    }
}

// adapter for express
export default class ExpressInfiniteLoader<T> extends InfiniteLoader<T> {

    constructor(query: Request["query"], itemsPerLoad = ITEMS_PER_LOAD) {
        super(query.filter as string,
            query.orderBy as string,
            parseInt(query.skip as string),
            itemsPerLoad
        );
    }
}