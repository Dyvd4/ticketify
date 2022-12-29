// TODO: construct fancy mapped type for variant 

type ListResultVariant = {
    name: "pagination"
} | {
    name: "infiniteLoading"
    variant: InfiniteLoadingVariantVariants
} | {
    name: "normal"
}

export type InfiniteLoadingVariantVariants = {
    name: "load-more-button"
} | {
    name: "intersection-observer"
}

export type ListResultVariantNames = ListResultVariant["name"]
export type InfiniteLoadingVariantVariantNames = InfiniteLoadingVariantVariants["name"];

export default class ListResult<T> {

    items: T[]
    variant: ListResultVariant

    constructor(items: T[], variant: ListResultVariant = { name: "normal" }) {
        this.items = items;
        this.variant = variant;
    }
}