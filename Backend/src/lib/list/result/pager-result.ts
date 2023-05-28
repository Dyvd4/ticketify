import ListResult from "./list-result";

export default class PagerResult<T> extends ListResult<T> {
	prevPage: number;
	nextPage: number;
	pagesCount: number;
	pagesCountShrunk: boolean;
	pageIsFull: boolean;

	constructor(items: T[], totalItemsCount: number, itemsPerPage: number, currentPage: number) {
		super(items);

		this.pageIsFull = this.items.length === itemsPerPage;

		this.pagesCount = Math.floor(totalItemsCount / itemsPerPage);
		this.pagesCount += totalItemsCount % itemsPerPage > 0 ? 1 : 0;
		if (this.pagesCount === 0) this.pagesCount = 1;

		this.pagesCountShrunk = !!currentPage && currentPage > this.pagesCount;

		const sanitizedCurrentPage = this.pagesCountShrunk ? this.pagesCount : currentPage;

		this.prevPage = sanitizedCurrentPage !== 1 ? sanitizedCurrentPage - 1 : 1;

		this.nextPage =
			sanitizedCurrentPage < this.pagesCount ? sanitizedCurrentPage + 1 : this.pagesCount;
	}
}
