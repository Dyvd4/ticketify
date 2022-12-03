import { ListResultPrismaArgs } from "..";
import ListResult from "./ListResult";

export default class InfiniteLoadingResult<T> extends ListResult<T>{

    nextSkip?: number

    constructor(items: T[], itemsCount: number, { skip }: ListResultPrismaArgs, itemsPerLoad: number) {
        super(items, "infiniteLoading");
        const newNextSkip = skip + itemsPerLoad;
        this.nextSkip = newNextSkip < itemsCount
            ? newNextSkip
            : undefined
    }
}