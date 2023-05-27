import { InfiniteLoader } from ".";
import { testItems } from "./setup-tests";

const ITEMS_PER_LOAD = 2;

describe("result", () => {
    it("calculates nextSkip", () => {
        const infiniteLoader = new InfiniteLoader({ skip: 2 }, ITEMS_PER_LOAD);

        const result = infiniteLoader.getResult(testItems.slice(2, 4), testItems.length);

        expect(result.nextSkip).toBe(4);
    });

    it("sets nextSkip to undefined if there's no more items to fetch", () => {
        const infiniteLoader = new InfiniteLoader({ skip: 8 }, ITEMS_PER_LOAD);

        const result = infiniteLoader.getResult(testItems.slice(8, 10), testItems.length);

        expect(result.nextSkip).toBe(undefined);
    });
});
