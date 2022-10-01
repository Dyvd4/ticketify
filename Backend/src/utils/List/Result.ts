type ListResultType = "pagination" | "infiniteLoading" | "normal";

export abstract class ListResult<T>{
    items: T[]
    type: ListResultType
    constructor(items: T[], type: ListResultType) {
        this.items = items;
        this.type = type;
    }
}

export default class NormalListResult<T> extends ListResult<T>{
    constructor(items: T[]) {
        super(items, "normal");
    }
}