import { ListResultPrismaArgs } from "..";
import ListResult from "./list-result";

export default class InfiniteLoaderResult<T> extends ListResult<T> {
    nextSkip?: number;

    constructor(
        items: T[],
        itemsCount: number,
        { skip }: ListResultPrismaArgs,
        itemsPerLoad: number
    ) {
        super(items);
        const newNextSkip = skip + itemsPerLoad;
        this.nextSkip = newNextSkip < itemsCount ? newNextSkip : undefined;
    }
}
