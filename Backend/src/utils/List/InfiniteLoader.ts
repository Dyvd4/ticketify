import { ListResultPrismaArgs } from ".";
import { ListResult } from "./Result";

const ITEMS_PER_LOAD = 10;

class InfiniteLoadingResult<T> extends ListResult<T>{

    nextSkip?: number

    constructor(items: T[], itemsCount: number, { skip }: ListResultPrismaArgs, itemsPerLoad: number) {
        super(items, "infiniteLoading");
        const newNextSkip = skip + itemsPerLoad;
        this.nextSkip = newNextSkip < itemsCount
            ? newNextSkip
            : undefined
    }
}

export default class InfiniteLoader<T>{

    private prismaArgs: ListResultPrismaArgs;
    private itemsPerLoad: number;

    constructor(query, itemsPerLoad = ITEMS_PER_LOAD) {

        this.itemsPerLoad = itemsPerLoad;

        this.prismaArgs = {
            skip: parseInt(query.skip) || 0,
            take: itemsPerLoad
        }
    }

    getPrismaArgs = () => this.prismaArgs;

    getResult = (items: T[], itemsCount: number) => {
        return new InfiniteLoadingResult(items, itemsCount, this.prismaArgs, this.itemsPerLoad);
    }
}