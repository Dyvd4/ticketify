type ListResultType = "pagination" | "infiniteLoading";

export default abstract class ListResult<T>{
    items: T[]
    type: ListResultType
    constructor(items: T[], type: ListResultType) {
        this.items = items;
        this.type = type;
    }
}