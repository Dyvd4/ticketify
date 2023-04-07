export default class ListResult<T> {

    items: T[]

    constructor(items: T[]) {
        this.items = items;
    }
}