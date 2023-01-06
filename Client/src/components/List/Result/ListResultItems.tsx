import { InfiniteData } from "react-query";
import { ListResultVariantNames } from "./hooks/useListResultVariant"
import ListResultEmptyDisplay from "./ListResultEmptyDisplay";

export type ListResult = {
    [Key in PropertyKey]: any
} & {
    items: any[]
    variant: ListResultVariantNames
}

type ListResultItemsProps = {
    data: InfiniteData<ListResult>
    children(item: any): JSX.Element
    emptyDisplay?: JSX.Element
}

function ListResultItems({ data, ...props }: ListResultItemsProps) {
    return <>
        {data.pages.map(page => (
            page.items.length > 0
                ? page.items.map((item) => (
                    <div className="infinite-query-item" key={item.id}>
                        {props.children(item)}
                    </div>
                ))
                : props.emptyDisplay || <ListResultEmptyDisplay />
        ))}
    </>
}

export default ListResultItems;