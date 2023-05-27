import List, { FilterQueryParams, OrderByQueryParams } from "./list";
import { PagerQueryDto } from "./list.dtos";
import { PagerResult } from "./result";

const ITEMS_PER_PAGE = 10;

class Pager<T> extends List {
    private currentPage: number;

    constructor(
        prismaFilter: FilterQueryParams,
        prismaOrderBy: OrderByQueryParams,
        currentPage: number,
        itemsPerLoad = ITEMS_PER_PAGE
    ) {
        const skip = (currentPage - 1) * itemsPerLoad;

        const prismaArgs = {
            skip: skip,
            take: itemsPerLoad,
        };

        super(prismaFilter, prismaOrderBy, prismaArgs, itemsPerLoad);
        this.currentPage = currentPage;
    }

    getResult = (items: T[], totalItemsCount: number) => {
        return new PagerResult(items, totalItemsCount, this.itemsPerLoad, this.currentPage);
    };
}

// adapter for NestJs
export default class NestJsPager<T> extends Pager<T> {
    constructor(queryDto: PagerQueryDto) {
        super(
            queryDto.filter || [],
            queryDto.orderBy || [],
            queryDto.page,
            queryDto.itemsPerPage || ITEMS_PER_PAGE
        );
    }
}
