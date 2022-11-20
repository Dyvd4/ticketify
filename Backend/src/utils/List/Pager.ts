import { ListResultPrismaArgs } from ".";
import { ListResult } from "./Result"

const ITEMS_PER_PAGE = 10;

class PagerResult<T> extends ListResult<T>{

    currentPage: number
    pagesCount: number
    pagesCountShrunk: boolean

    constructor(items: T[], itemsCount: number, { skip }: ListResultPrismaArgs, itemsPerPage: number) {
        super(items, "pagination");
        this.pagesCount = Math.floor(itemsCount / itemsPerPage);
        this.pagesCount += itemsCount % itemsPerPage > 0 ? 1 : 0
        const currentPage = skip / itemsPerPage + 1
        // get nearest possible if this page is not available anymores?
        this.pagesCountShrunk = !!currentPage && currentPage > this.pagesCount;
        this.currentPage = !this.pagesCountShrunk && !!currentPage
            ? currentPage as number
            : 1;
    }
}

export default class Pager<T> {

    private prismaArgs: ListResultPrismaArgs;
    private itemsPerPage: number;

    constructor(query, itemsPerPage = ITEMS_PER_PAGE) {

        this.itemsPerPage = itemsPerPage;

        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * itemsPerPage;

        this.prismaArgs = {
            skip: skip,
            take: itemsPerPage
        }
    }

    getPrismaArgs = () => this.prismaArgs;

    getResult = (items: T[], itemsCount: number) => {
        return new PagerResult(items, itemsCount, this.prismaArgs, this.itemsPerPage);
    }
}
