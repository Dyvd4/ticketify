import Pager from "../Pager";

const testItems = [
    {
        "id": 1,
        "isAmazing": true,
        "description": "A - description",
        "createdAt": "2022-08-20T10:42:07.683Z"
    },
    {
        "id": 2,
        "isAmazing": false,
        "description": "Whatsoever",
        "createdAt": "2022-08-20T10:42:07.776Z"
    },
    {
        "id": 3,
        "isAmazing": false,
        "description": "Z - description",
        "createdAt": "2022-08-20T11:58:52.313Z"
    },
    {
        "id": 4,
        "isAmazing": true,
        "description": "Idk",
        "createdAt": "2022-08-20T10:42:07.776Z"
    },
    {
        "id": 5,
        "isAmazing": true,
        "description": "HE HE! ??",
        "createdAt": "2022-08-22T14:23:47.060Z"
    },
    {
        "id": 6,
        "isAmazing": false,
        "description": "Jackson HEHE! ??",
        "createdAt": "2022-08-22T14:23:47.103Z"
    },
    {
        "id": 7,
        "isAmazing": true,
        "description": "DoubleYou Tee Ef",
        "createdAt": "2022-08-22T14:23:47.103Z"
    },
    {
        "id": 8,
        "isAmazing": true,
        "description": "Hahahahahaha",
        "createdAt": "2022-08-22T15:19:26.920Z"
    },
    {
        "id": 9,
        "isAmazing": false,
        "description": "Walla",
        "createdAt": "2022-08-22T15:19:26.920Z"
    },
    {
        "id": 10,
        "isAmazing": true,
        "description": "Yalla",
        "createdAt": "2022-08-22T15:19:26.920Z"
    }
]

describe("pagerResult", () => {
    it("detects if pagesCount shrunk", () => {
        const pager = new Pager({ page: 5 }, 3);
        const result = pager.getResult(testItems.slice(0, 3), testItems.length);

        expect(result.pagesCountShrunk).toBe(true);
    });

    it("sets currentPage to nearest possible page if pagesCount shrunk", () => {
        const pager = new Pager({ page: 5 }, 3);
        const result = pager.getResult(testItems.slice(0, 3), testItems.length);

        expect(result.currentPage).toBe(4);
    });

    it("calculates pagesCount", () => {
        const pager = new Pager({ page: 5 }, 3);
        const result = pager.getResult(testItems.slice(0, 3), testItems.length);

        expect(result.pagesCount).toBe(4);
    });
});

describe("prismaArgs", () => {
    const itemsPerPage = 3;

    it("gets items per page", () => {
        const pager = new Pager({ page: 1 }, itemsPerPage);
        const prismaArgs = pager.getPrismaArgs();

        expect(prismaArgs.take).toBe(itemsPerPage);
    });

    it("calculates skip", () => {
        const pager = new Pager({ page: 2 }, itemsPerPage);
        const prismaArgs = pager.getPrismaArgs();

        expect(prismaArgs.skip).toBe(3);
    });
});
