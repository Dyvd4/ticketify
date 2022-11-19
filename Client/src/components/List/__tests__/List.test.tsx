import autoAnimate from "@formkit/auto-animate";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { createRef } from "react";
import { useInfiniteQuery, useInfiniteQueryCount } from "src/hooks/infiniteQuery";
import ListItemContent from "src/pages/Test/ListItemContent";
import List from "..";
import ListItem from "../ListItem";

jest.mock("../../../hooks/infiniteQuery", () => ({
    useInfiniteQuery: jest.fn(),
    useInfiniteQueryCount: jest.fn()
}));
jest.mock("@formkit/auto-animate");

const mockedUseInfiniteQuery = useInfiniteQuery as jest.Mock<any>
const mockedUseInfiniteQueryCount = useInfiniteQueryCount as jest.Mock<any>
const mockedAutoAnimate = autoAnimate as jest.Mock<any>

const pages = [
    {

        "items": [
            {
                "id": 1,
                "title": "react console errors",
                "description": "<p>testestststs</p>",
                "dueDate": "2022-09-04T17:36:00.000Z",
                "createdAt": "2022-08-31T14:21:33.861Z",
                "updatedAt": "2022-11-11T22:01:21.277Z",
                "createUser": "test",
                "updateUser": "test",
                "statusId": null,
                "priority": {
                    "color": "slate-500",
                    "name": "Low",
                    "createdAt": "2022-08-16T23:00:32.037Z",
                    "updatedAt": "2022-08-18T08:41:34.420Z",
                    "createUser": "test",
                    "updateUser": "test"
                }
            },
            {
                "id": 7,
                "title": "test hahah niiice",
                "description": "<p><br></p>",
                "dueDate": "2022-10-09T13:26:00.000Z",
                "createdAt": "2022-10-09T13:36:07.078Z",
                "updatedAt": "2022-11-18T16:34:31.226Z",
                "createUser": "test",
                "updateUser": "test",
                "statusId": null,
                "priority": {
                    "color": "red-500",
                    "name": "High",
                    "createdAt": "2022-08-18T08:39:51.514Z",
                    "updatedAt": "2022-08-18T08:39:51.514Z",
                    "createUser": "test",
                    "updateUser": "test"
                }
            },
            {
                "id": 8,
                "title": "testdd",
                "description": "<p><br></p>",
                "dueDate": "2022-10-22T12:13:00.000Z",
                "createdAt": "2022-10-22T12:13:24.423Z",
                "updatedAt": "2022-11-11T23:47:01.451Z",
                "createUser": "test",
                "updateUser": "test",
                "statusId": null,
                "priority": {
                    "color": "slate-500",
                    "name": "Low",
                    "createdAt": "2022-08-16T23:00:32.037Z",
                    "updatedAt": "2022-08-18T08:41:34.420Z",
                    "createUser": "test",
                    "updateUser": "test"
                }
            },
            {
                "id": 17,
                "title": "4rty",
                "description": "<p>yrdy</p>",
                "dueDate": "2022-11-11T22:56:00.000Z",
                "createdAt": "2022-11-11T22:56:26.214Z",
                "updatedAt": "2022-11-11T22:56:26.214Z",
                "createUser": "test",
                "updateUser": "test",
                "statusId": null,
                "priority": {
                    "color": "yellow-500",
                    "name": "Middle",
                    "createdAt": "2022-08-25T14:57:58.946Z",
                    "updatedAt": null,
                    "createUser": "test",
                    "updateUser": "test"
                }
            },
            {
                "id": 18,
                "title": "testtestesteststestest",
                "description": "<p><br></p>",
                "dueDate": "2022-11-11T22:58:00.000Z",
                "createdAt": "2022-11-11T22:58:41.928Z",
                "updatedAt": "2022-11-11T22:58:54.839Z",
                "createUser": "test",
                "updateUser": "test",
                "statusId": null,
                "priority": {
                    "color": "red-500",
                    "name": "High",
                    "createdAt": "2022-08-18T08:39:51.514Z",
                    "updatedAt": "2022-08-18T08:39:51.514Z",
                    "createUser": "test",
                    "updateUser": "test"
                }
            }
        ],
        "type": "pagination",
        "currentPage": 1,
        "pagesCount": 2,
        "pagesCountShrunk": false
    }
]

const listRenderer = () => (
    render(<List
        fetch={{
            route: "test",
            queryKey: "test"
        }}
        listItemRender={(item) => <ListItem content={<ListItemContent item={item} />} />}
        header={{
            title: "test",
            showCount: true
        }}
        sort={[
            {
                property: "isAmazing",
                label: "Is amazing"
            },
            {
                property: "description",
            },
            {
                property: "createdAt",
                label: "created at"
            }
        ]}
        filter={[]}
    />)
)

beforeEach(() => {
    const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
        observe: () => null
    }));
    window.IntersectionObserver = mockIntersectionObserver
    mockedUseInfiniteQuery.mockImplementation(() => ({
        data: {
            pages
        },
        isLoading: false,
        isError: false,
        isFetchingNextPage: false,
        hasNextPage: false,
        fetchNextPage: () => { }
    }));
    mockedUseInfiniteQueryCount.mockImplementation(() => (5));
    mockedAutoAnimate.mockReturnValue(createRef());
});

describe("header", () => {
    it("renders title", () => {
        listRenderer();

        expect(within(screen.getByTestId("ListHeader")).getByText("test")).toBeTruthy();
    });
    it("renders count", () => {
        listRenderer();

        expect(within(screen.getByTestId("ListHeader")).getByText("(5)")).toBeTruthy();
    });
});

describe("listItems", () => {
    it("renders correct amount of listItems", () => {
        listRenderer();

        expect(screen.getAllByTestId("ListItem")).toHaveLength(5);
    });
});

describe("filter", () => {

    const listRenderer = () => (
        render(
            <List
                fetch={{
                    route: "test",
                    queryKey: "test"
                }}
                listItemRender={(item) => <ListItem content={<ListItemContent item={item} />} />}
                header={{
                    title: "test",
                    showCount: true
                }}
                sort={[]}
                filter={[
                    {
                        property: "isAmazing",
                        type: "boolean",
                        label: "Is amazing"
                    },
                    {
                        property: "description",
                        type: "string",
                    },
                    {
                        property: "createdAt",
                        type: "date",
                        label: "created at"
                    }
                ]}
            />)
    );

    it("renders filter button", async () => {
        listRenderer();

        expect(screen.getByTestId("ListHeader-filter-button")).toBeTruthy();
    });

    describe("filter items", () => {
        it("renders inputs", async () => {
            listRenderer();

            const filterButton = screen.getByTestId("ListHeader-filter-button");
            fireEvent.click(filterButton);

            const drawer = await screen.findByTestId("FilterDrawer");

            expect(within(drawer).getByLabelText("Is amazing")).toBeTruthy();
            expect(within(drawer).getByLabelText("description")).toBeTruthy();
            expect(within(drawer).getByLabelText("created at")).toBeTruthy();
        });
        it("renders operations", async () => {
            listRenderer();

            const filterButton = screen.getByTestId("ListHeader-filter-button");
            fireEvent.click(filterButton);

            const drawer = await screen.findByTestId("FilterDrawer");

            expect(within(drawer).getByText("contains")).toBeTruthy();
            expect(within(drawer).getByText("greater than")).toBeTruthy();
            expect(within(drawer).getAllByText("equals")).toHaveLength(3);
        });
    });
});

describe("sort", () => {

    const listRenderer = () => (
        render(<List
            fetch={{
                route: "test",
                queryKey: "test"
            }}
            listItemRender={(item) => <ListItem content={<ListItemContent item={item} />} />}
            header={{
                title: "test",
                showCount: true
            }}
            sort={[
                {
                    property: "isAmazing",
                    label: "Is amazing"
                },
                {
                    property: "description",
                },
                {
                    property: "createdAt",
                    label: "created at"
                }
            ]}
            filter={[]}
        />)
    );

    it("renders sort button", () => {
        listRenderer();

        expect(screen.getByTestId("ListHeader-sort-button")).toBeTruthy();
    });

    describe("sort items", () => {
        it("renders inputs", async () => {
            listRenderer();

            const sortButton = screen.getByTestId("ListHeader-sort-button");
            fireEvent.click(sortButton);

            const drawer = await screen.findByTestId("SortDrawer");

            expect(within(drawer).getByDisplayValue("Is amazing")).toBeTruthy();
            expect(within(drawer).getByDisplayValue("description")).toBeTruthy();
            expect(within(drawer).getByDisplayValue("created at")).toBeTruthy();
        });
        it("renders directions", async () => {
            listRenderer();

            const sortButton = screen.getByTestId("ListHeader-sort-button");
            fireEvent.click(sortButton);

            const drawer = await screen.findByTestId("SortDrawer");

            expect(within(drawer).getAllByText("ascending")).toHaveLength(3);
            expect(within(drawer).getAllByText("descending")).toHaveLength(3);
        });
    });
});

describe("pager", () => {
    it("renders pager", () => {
        listRenderer();

        expect(screen.getByTestId("Pager")).toBeTruthy();
    });
    it("renders number buttons", () => {
        listRenderer();

        expect(within(screen.getByTestId("Pager")).getAllByTestId("NumberButton")).toHaveLength(2);
    });
});