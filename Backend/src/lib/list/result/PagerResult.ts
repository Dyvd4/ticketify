
import ListResult from "./ListResult";

export default class PagerResult<T> extends ListResult<T>{

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
