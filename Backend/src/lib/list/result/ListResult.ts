type ListResultType = "pagination" | "infiniteLoading" | "normal";

export default class ListResult<T> {

    items: T[]
    type: ListResultType
    
    constructor(items: T[], type: ListResultType = "normal") {
        this.items = items;
        this.type = type;
    }
}