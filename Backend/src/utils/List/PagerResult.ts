import { ListResultPrismaParams } from ".";
import ListResult from "./Result"

const ITEMS_PER_PAGE = 10;

export const prismaParams = (query): ListResultPrismaParams => {
    return {
        skip: (parseInt(query.page) - 1) || 0,
        take: ITEMS_PER_PAGE
    }
}

export default class PagerResult<T> extends ListResult<T>{

    currentPage: number
    pagesCount: number
    pagesCountShrunk: boolean

    constructor(items: T[], itemsCount: number, { skip }: ListResultPrismaParams) {
        super(items, "pagination");
        this.pagesCount = Math.floor(itemsCount / ITEMS_PER_PAGE);
        this.pagesCount += itemsCount % ITEMS_PER_PAGE > 0 ? 1 : 0
        const currentPage = skip + 1
        // get nearest possible if this page is not available anymores?
        this.pagesCountShrunk = !!currentPage && currentPage > this.pagesCount;
        this.currentPage = !this.pagesCountShrunk && !!currentPage
            ? currentPage as number
            : 1;
    }
}