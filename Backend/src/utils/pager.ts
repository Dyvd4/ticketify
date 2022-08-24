export class PagerResult<T>{
    currentPage: number
    pagesCount: number
    items: T[]
    constructor(items: T[], itemsPerPage: number, currentPage?: number) {
        this.pagesCount = parseInt(Number(items.length / itemsPerPage).toFixed());
        this.pagesCount += items.length % itemsPerPage > 0 ? 1 : 0
        // get nearest possible if this page is not available anymores?
        this.currentPage = !!currentPage && currentPage <= this.pagesCount
            ? currentPage
            : 1;
        const startIndex = (this.currentPage! - 1 > - 1 ? this.currentPage! - 1 : 0) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        this.items = items.slice(startIndex, endIndex);
    }
}