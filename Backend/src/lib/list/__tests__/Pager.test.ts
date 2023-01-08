import { Pager } from "..";
import { testItems } from "./setupTests";

describe("pagerResult", () => {
    it("detects if pagesCount shrunk", () => {
        const pager = new Pager({ page: "5" }, 3);
        const result = pager.getResult(testItems.slice(0, 3), testItems.length);

        expect(result.pagesCountShrunk).toBe(true);
    });

    it("sets nextPage to nearest possible page if pagesCount shrunk", () => {
        const pager = new Pager({ page: "5" }, 3);
        const result = pager.getResult(testItems.slice(0, 3), testItems.length);

        expect(result.pagesCountShrunk).toBe(true);
        expect(result.nextPage).toBe(4);
    });

    it("calculates pagesCount", () => {
        const pager = new Pager({ page: "5" }, 3);
        const result = pager.getResult(testItems.slice(0, 3), testItems.length);

        expect(result.pagesCount).toBe(4);
    });
});

describe("prismaArgs", () => {
    const itemsPerPage = 3;

    it("gets items per page", () => {
        const pager = new Pager({ page: "1" }, itemsPerPage);
        const prismaArgs = pager.getPrismaArgs();

        expect(prismaArgs.take).toBe(itemsPerPage);
    });

    it("calculates skip", () => {
        const pager = new Pager({ page: "2" }, itemsPerPage);
        const prismaArgs = pager.getPrismaArgs();

        expect(prismaArgs.skip).toBe(3);
    });
});
