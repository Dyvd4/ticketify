import InfiniteLoader from "./infinite-loader";
import Pager from "./pager";

export { getMappedPrismaFilterArgs, getMappedPrismaOrderByArgs } from "./list";
export { InfiniteLoader, Pager };
export type ListResultPrismaArgs = {
    skip: number;
    take: number;
};
