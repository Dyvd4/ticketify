type Variant<VariantName, PropertyObj> = PropertyObj extends object
    ? ({
        [K in keyof PropertyObj]: PropertyObj[K]
    } & {
        name: VariantName
    })
    : {
        name: VariantName
    }

type ListResultVariant = Variant<"pagination", null> |
    Variant<"infiniteLoading", { variant: InfiniteLoadingVariantVariants }> |
    Variant<"normal", null>

export type InfiniteLoadingVariantVariants = Variant<"load-more-button", null> |
    Variant<"intersection-observer", null>

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