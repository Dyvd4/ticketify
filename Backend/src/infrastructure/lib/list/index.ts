import InfiniteLoader from "./InfiniteLoader"
import Pager from "./Pager"

export { expressPrismaOrderByArgs, expressPrismaFilterArgs } from "./List"
export { InfiniteLoader, Pager }
export type ListResultPrismaArgs = {
    skip: number
    take: number
}