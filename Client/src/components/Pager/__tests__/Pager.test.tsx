import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import React from "react";
import Pager from "../Pager"
import { Mock, vi } from "vitest"

const PagerDummy = ({ pagesCount, initialPage = 1 }) => {
    const [page, setPage] = React.useState(initialPage);
    return (
        <Pager
            onChange={(page) => setPage(page)}
            currentPage={page}
            pagesCount={pagesCount}
        />
    )
}

beforeEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

it("displays page button with value of first page", () => {
    render(<PagerDummy pagesCount={11} />);

    const pager = screen.getByTestId("Pager");

    expect(within(pager).getByText("1")).toBeTruthy();
});

it("displays page button with value of last page", () => {
    render(<PagerDummy pagesCount={11} />);

    const pager = screen.getByTestId("Pager");

    expect(within(pager).getByText("11")).toBeTruthy();
});

it("lets navigate via next button", () => {

    const setState = vi.fn();
    (vi.spyOn(React, "useState") as Mock<any>)
        .mockImplementation((initialState) => [initialState, setState]);

    render(<PagerDummy pagesCount={11} />);

    const pager = screen.getByTestId("Pager");
    const nextButton = within(pager).getByTestId("next-button");

    fireEvent.click(nextButton);
    expect(setState).toHaveBeenCalledWith(2);

});

it("lets navigate via prev button", () => {

    const setState = vi.fn();
    (vi.spyOn(React, "useState") as Mock<any>)
        .mockImplementation((initialState) => [initialState, setState]);

    render(<PagerDummy pagesCount={11} initialPage={2} />);

    const pager = screen.getByTestId("Pager");
    const prevButton = within(pager).getByTestId("prev-button");

    fireEvent.click(prevButton);
    expect(setState).toHaveBeenCalledWith(1);

});

describe("pages count = 7", () => {
    it("displays all page buttons", () => {
        render(<PagerDummy pagesCount={7} />);

        const pager = screen.getByTestId("Pager");

        new Array(7).map((val, i) => i + 1).forEach(number => {
            expect(within(pager).getByText(number)).toBeTruthy();
        });
    });
});

describe("pages count > 7", () => {
    describe("initial page < 5", () => {
        it("doesn't display page buttons with value > 5 (last page excluded)", () => {
            render(<PagerDummy pagesCount={11} />);

            const pager = screen.getByTestId("Pager");

            [6, 7, 8, 9, 10].forEach((number) => {
                expect(within(pager).queryByText(number)).not.toBeTruthy();
            });
        });

        it("lets navigate through page buttons with value > 5", () => {
            render(<PagerDummy pagesCount={11} />);

            const pager = screen.getByTestId("Pager");

            fireEvent.click(within(pager).getByText("5"));
            expect(within(pager).getByText("6")).toBeTruthy();

            fireEvent.click(within(pager).getByText("6"));
            expect(within(pager).getByText("7")).toBeTruthy();

            fireEvent.click(within(pager).getByText("5"));
            expect(within(pager).getByText("4")).toBeTruthy();

            fireEvent.click(within(pager).getByText("4"));
            expect(within(pager).getByText("3")).toBeTruthy();
        });
    });
});