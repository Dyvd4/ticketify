import { Request } from "express";
import List from "./List";
import { InfiniteLoadingResult } from "./result";

const ITEMS_PER_LOAD = 10;

export default class InfiniteLoader<T> extends List {

    constructor(query: Request["query"], itemsPerLoad = ITEMS_PER_LOAD) {
        const prismaArgs = {
            skip: parseInt(query.skip as string) || 0,
            take: itemsPerLoad
        };
        super(query, prismaArgs, itemsPerLoad);
    }

    getResult = (items: T[], itemsCount: number) => {
        return new InfiniteLoadingResult(items, itemsCount, this.prismaArgs, this.itemsPerLoad);
    }
}