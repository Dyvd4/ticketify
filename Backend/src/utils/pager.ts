export class PagerResult<T>{
    currentPage: number
    pagesCount: number
    pagesCountShrunk: boolean
    items: T[]
    constructor(items: T[], itemsPerPage: number, currentPage: number) {
        this.pagesCount = Math.floor(items.length / itemsPerPage);
        this.pagesCount += items.length % itemsPerPage > 0 ? 1 : 0
        // get nearest possible if this page is not available anymores?
        this.pagesCountShrunk = !!currentPage && currentPage > this.pagesCount;
        this.currentPage = !this.pagesCountShrunk && !!currentPage
            ? currentPage as number
            : 1;
        const startIndex = (this.currentPage! - 1 > - 1 ? this.currentPage! - 1 : 0) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        this.items = items.slice(startIndex, endIndex);
    }
}