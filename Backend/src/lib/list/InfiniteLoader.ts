import { Request } from "express";
import List from "./List";
import { InfiniteLoaderResult } from "./result";
import { InfiniteLoadingVariantVariantNames } from "./result/ListResult";

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

    /** @param variantName the variant for the infinite-loading result
     * - is currently being picked up by the `List` component and passed down to the `InfiniteLoaderResultItems` component in the client
     * */
    getResult = (items: T[], itemsCount: number, variantName?: InfiniteLoadingVariantVariantNames) => {
        return new InfiniteLoaderResult(
            items,
            itemsCount,
            this.prismaArgs,
            this.itemsPerLoad,
            { name: variantName! }
        );
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