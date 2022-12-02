import InfiniteLoader from "./InfiniteLoader"
import Pager from "./Pager"

export { prismaOrderByArgs, prismaFilterArgs } from "./List"
export { InfiniteLoader, Pager }
export type ListResultPrismaArgs = {
    skip: number
    take: number
}