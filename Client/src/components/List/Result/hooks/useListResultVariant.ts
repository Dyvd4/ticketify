import { InfiniteData } from "react-query"

// 🥵 ctrl c & ctrl v from backend
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

const useListResultVariant = (data: InfiniteData<any> | undefined) => {
    return data && data.pages.length > 0
        ? data.pages[0].variant as ListResultVariant
        : null
}

export default useListResultVariant