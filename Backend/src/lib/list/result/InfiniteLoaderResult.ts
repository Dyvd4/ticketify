import { ListResultPrismaArgs } from "..";
import ListResult, { InfiniteLoadingVariantVariants } from "./ListResult";

export default class InfiniteLoaderResult<T> extends ListResult<T>{

    nextSkip?: number

    constructor(
        items: T[],
        itemsCount: number,
        { skip }: ListResultPrismaArgs,
        itemsPerLoad: number,
        variant: InfiniteLoadingVariantVariants = { name: "intersection-observer" }
    ) {
        super(items, { name: "infiniteLoading", variant });
        const newNextSkip = skip + itemsPerLoad;
        this.nextSkip = newNextSkip < itemsCount
            ? newNextSkip
            : undefined
    }
}