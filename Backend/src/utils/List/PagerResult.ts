import { ListResultPrismaArgs } from ".";
import { ListResult } from "./Result"

const ITEMS_PER_PAGE = 10;

export const prismaArgs = (query): ListResultPrismaArgs => {
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE;
    return {
        skip,
        take: ITEMS_PER_PAGE
    }
}

export default class PagerResult<T> extends ListResult<T>{

    currentPage: number
    pagesCount: number
    pagesCountShrunk: boolean

    constructor(items: T[], itemsCount: number, { skip }: ListResultPrismaArgs) {
        super(items, "pagination");
        this.pagesCount = Math.floor(itemsCount / ITEMS_PER_PAGE);
        this.pagesCount += itemsCount % ITEMS_PER_PAGE > 0 ? 1 : 0
        const currentPage = skip / ITEMS_PER_PAGE + 1
        // get nearest possible if this page is not available anymores?
        this.pagesCountShrunk = !!currentPage && currentPage > this.pagesCount;
        this.currentPage = !this.pagesCountShrunk && !!currentPage
            ? currentPage as number
            : 1;
    }
}