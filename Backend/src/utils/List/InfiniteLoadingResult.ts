import { ListResultPrismaParams } from ".";
import { ListResult } from "./Result";

const ITEMS_PER_LOAD = 10;

export const prismaArgs = (query): ListResultPrismaParams => {
    return {
        skip: parseInt(query.skip) || 0,
        take: ITEMS_PER_LOAD
    }
}

export default class InfiniteLoadingResult<T> extends ListResult<T>{

    nextSkip?: number

    constructor(items: T[], itemsCount: number, { skip }: ListResultPrismaParams) {
        super(items, "infiniteLoading");
        const newNextSkip = skip + ITEMS_PER_LOAD;
        this.nextSkip = newNextSkip < itemsCount
            ? newNextSkip
            : undefined
    }
}