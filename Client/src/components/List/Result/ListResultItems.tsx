import { Box, BoxProps } from "@chakra-ui/react";
import { InfiniteData } from "react-query";
import ListResultEmptyDisplay from "./ListResultEmptyDisplay";
import { PagerResult } from "./PagerResultItems";

type Variant<VariantName, PropertyObj> = PropertyObj extends object
    ? ({
        [K in keyof PropertyObj]: PropertyObj[K]
    } & {
        name: VariantName
    })
    : {
        name: VariantName
    }

export type ListResultVariant = Variant<"pagination", null> |
    Variant<"infiniteLoading", { variant: InfiniteLoadingVariantVariants }> |
    Variant<"normal", null>

export type InfiniteLoadingVariantVariants = Variant<"load-more-button", null> |
    Variant<"intersection-observer", null>

export type ListResultVariantNames = ListResultVariant["name"]
export type InfiniteLoadingVariantVariantNames = InfiniteLoadingVariantVariants["name"];

export type ListResult = {
    items: any[]
    variant: ListResultVariantNames
}

type ListResultItemsProps = {
    children(item: any): JSX.Element
    emptyDisplay?: JSX.Element
    className?: string
    as?: BoxProps["as"]
} & ({
    variant: Extract<ListResultVariantNames, "pagination">
    data: PagerResult
} | {
    variant: Extract<ListResultVariantNames, "infiniteLoading">
    data: InfiniteData<ListResult>
})

function ListResultItems({ data, variant, className, ...props }: ListResultItemsProps) {
    return <>
        {variant === "pagination" && <>
            {data.items.length > 0
                ? data.items.map((item) => (
                    <Box
                        as={props.as}
                        className={`page-query-item ${className}`}
                        key={item.id}>
                        {props.children(item)}
                    </Box>
                ))
                : props.emptyDisplay || <ListResultEmptyDisplay key={1} />}
        </>}
        {variant === "infiniteLoading" && <>
            {data.pages.map(page => (
                page.items.length > 0
                    ? page.items.map((item) => (
                        <Box
                            as={props.as}
                            className={`infinite-query-item ${className}`}
                            key={item.id}>
                            {props.children(item)}
                        </Box>
                    ))
                    : props.emptyDisplay || <ListResultEmptyDisplay key={1} />
            ))}
        </>}
    </>
}

export default ListResultItems;