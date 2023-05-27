import { cleanup, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { test } from "vitest";
import Kanbanboard, { KanbanboardProps } from "../Kanbanboard";

const testKanbanGroups: KanbanboardProps<{
    id: number;
    title: string;
    description: string;
}>["groups"] = [
    {
        name: "Category A",
        items: [
            { id: 1, title: "Item 1", description: "Description for Item 1" },
            { id: 3, title: "Item 3", description: "Description for Item 3" },
            { id: 2, title: "Item 2", description: "Description for Item 2" },
        ],
    },
    {
        name: "Category B",
        items: [
            { id: 5, title: "Item 5", description: "Description for Item 5" },
            { id: 4, title: "Item 4", description: "Description for Item 4" },
        ],
    },
    {
        name: "Category C",
        items: [
            { id: 7, title: "Item 7", description: "Description for Item 7" },
            { id: 6, title: "Item 6", description: "Description for Item 6" },
            { id: 9, title: "Item 9", description: "Description for Item 9" },
            { id: 8, title: "Item 8", description: "Description for Item 8" },
        ],
    },
];

vi.mock("@formkit/auto-animate");

const HOC = () => {
    const [kanbanGroups, setKanbanGroups] = useState(testKanbanGroups);

    return (
        <Kanbanboard
            groups={kanbanGroups}
            setGroups={setKanbanGroups}
            groupItemsRenderer={(item) => (
                <div>
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                </div>
            )}
            orderByEvaluator={(a, b) => {
                return a.id - b.id;
            }}
        />
    );
};

beforeEach(cleanup);

test("renders", () => {
    render(<HOC />);

    const groups = [
        screen.getByText(testKanbanGroups[0].name),
        screen.getByText(testKanbanGroups[1].name),
        screen.getByText(testKanbanGroups[2].name),
    ];

    const groupItems = [
        screen.getByText(testKanbanGroups[0].items[0].description),
        screen.getByText(testKanbanGroups[1].items[0].description),
        screen.getByText(testKanbanGroups[2].items[0].description),
        screen.getByText(testKanbanGroups[0].items[1].description),
        screen.getByText(testKanbanGroups[2].items[1].description),
        screen.getByText(testKanbanGroups[2].items[1].description),
    ];

    expect(groups.every((group) => group)).toBeTruthy();
    expect(groupItems.every((groupItem) => groupItem)).toBeTruthy();
});

test("orders items", () => {
    render(<HOC />);

    const groupC = screen.getByText(testKanbanGroups[2].name);
    const groupCListItems = groupC.closest("li")!.querySelectorAll("li");

    expect(
        within(groupCListItems[0]).getByText(testKanbanGroups[2].items[1].description)
    ).toBeTruthy();
    expect(
        within(groupCListItems[1]).getByText(testKanbanGroups[2].items[0].description)
    ).toBeTruthy();
    expect(
        within(groupCListItems[2]).getByText(testKanbanGroups[2].items[3].description)
    ).toBeTruthy();
    expect(
        within(groupCListItems[3]).getByText(testKanbanGroups[2].items[2].description)
    ).toBeTruthy();
});
