import { render, RenderResult } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ResizeObserver from "resize-observer-polyfill";

declare global {
    let renderWithRouter: (renderComponent, route) => RenderResult;
}

(global as any).renderWithRouter = (renderComponent, route) => {
    window.history.pushState({}, "Test page", route);

    return render(<BrowserRouter>{renderComponent()}</BrowserRouter>);
};

// @formkit/auto-animate wasn't working bc of missing RezizeObserver
// shout out to this mf: https://stackoverflow.com/questions/64558062/how-to-mock-resizeobserver-to-work-in-unit-tests-using-react-testing-library
(global as any).ResizeObserver = ResizeObserver;

export const mockUser = {
    username: "David",
    email: "test@mail.com",
    emailConfirmed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const authenticatedUser = { ...mockUser };
export const fullyUnauthenticatedUser = null;
export const halfUnauthenticatedUser = {
    ...mockUser,
    emailConfirmed: false,
};

export const DummyComponent = () => {
    return <div data-testid="DummyComponent">Hello world</div>;
};
