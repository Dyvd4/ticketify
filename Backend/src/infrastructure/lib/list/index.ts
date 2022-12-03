import InfiniteLoader from "./InfiniteLoader"
import Pager from "./Pager"

export { getParsedPrismaFilterArgs, getParsedPrismaOrderByArgs } from "./List"
export { InfiniteLoader, Pager }
export type ListResultPrismaArgs = {
    skip: number
    take: number
}