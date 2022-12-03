import { Request } from "express";
import List from "./List";
import { PagerResult } from "./result";

const ITEMS_PER_PAGE = 10;

class Pager<T> extends List {

    private currentPage: number;

    constructor(
        prismaFilter: string,
        prismaOrderBy: string,
        page: number,
        itemsPerLoad = ITEMS_PER_PAGE
    ) {
        const currentPage = page || 1;
        const skip = (currentPage - 1) * itemsPerLoad;

        const prismaArgs = {
            skip: skip,
            take: itemsPerLoad
        }

        super(prismaFilter, prismaOrderBy, prismaArgs, itemsPerLoad);
        this.currentPage = currentPage;
    }

    getResult = (items: T[], totalItemsCount: number) => {
        return new PagerResult(items, totalItemsCount, this.itemsPerLoad, this.currentPage);
    }
}

// adapter for express
export default class ExpressPager<T> extends Pager<T> {
    constructor(query: Request["query"], itemsPerLoad = ITEMS_PER_PAGE) {
        super(
            query.filter as string,
            query.filter as string,
            parseInt(query.page as string),
            itemsPerLoad
        );
    }
}
