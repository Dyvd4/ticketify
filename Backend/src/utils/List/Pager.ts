import { ListResultPrismaArgs } from ".";
import { ListResult } from "./Result"

const ITEMS_PER_PAGE = 10;

class PagerResult<T> extends ListResult<T>{

    currentPage: number
    pagesCount: number
    pagesCountShrunk: boolean
    pageIsFull: boolean

    constructor(items: T[], totalItemsCount: number, itemsPerPage: number, currentPage: number) {
        super(items, "pagination");

        this.pageIsFull = this.items.length === itemsPerPage;

        this.pagesCount = Math.floor(totalItemsCount / itemsPerPage);
        this.pagesCount += totalItemsCount % itemsPerPage > 0 ? 1 : 0
        this.pagesCountShrunk = !!currentPage && currentPage > this.pagesCount;

        if (!currentPage) this.currentPage = 1;
        else if (this.pagesCountShrunk) this.currentPage = this.pagesCount; // nearest possible
        else this.currentPage = currentPage;
    }
}

export default class Pager<T> {

    private prismaArgs: ListResultPrismaArgs;
    private itemsPerPage: number;
    private currentPage: number;

    constructor(query, itemsPerPage = ITEMS_PER_PAGE) {

        this.itemsPerPage = itemsPerPage;

        this.currentPage = parseInt(query.page) || 1;
        const skip = (this.currentPage - 1) * itemsPerPage;

        this.prismaArgs = {
            skip: skip,
            take: itemsPerPage
        }
    }

    getPrismaArgs = () => this.prismaArgs;

    getResult = (items: T[], totalItemsCount: number) => {
        return new PagerResult(items, totalItemsCount, this.itemsPerPage, this.currentPage);
    }
}
