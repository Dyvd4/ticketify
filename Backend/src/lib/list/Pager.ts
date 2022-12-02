import { Request } from "express";
import List from "./List";
import { PagerResult } from "./result";

const ITEMS_PER_PAGE = 10;

export default class Pager<T> extends List {

    private currentPage: number;

    constructor(query: Request["query"], itemsPerLoad = ITEMS_PER_PAGE) {
        const currentPage = parseInt(query.page as string) || 1;
        const skip = (currentPage - 1) * itemsPerLoad;

        const prismaArgs = {
            skip: skip,
            take: itemsPerLoad
        }

        super(prismaArgs, itemsPerLoad);
        this.currentPage = currentPage;
    }

    getResult = (items: T[], totalItemsCount: number) => {
        return new PagerResult(items, totalItemsCount, this.itemsPerLoad, this.currentPage);
    }
}
