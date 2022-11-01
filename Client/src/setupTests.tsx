import { render, RenderResult } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

declare global {
    let renderWithRouter: (renderComponent, route) => RenderResult
}

(global as any).renderWithRouter = (renderComponent, route) => {

    window.history.pushState({}, "Test page", route);

    return render(
        <BrowserRouter>
            {renderComponent()}
        </BrowserRouter>
    )
}

export const mockUser = {
    username: "David",
    email: "test@mail.com",
    emailConfirmed: true,
    createdAt: new Date(),
    updatedAt: new Date()
}
export const authorizedUser = { ...mockUser };
export const unauthorizedUser = {
    ...mockUser,
    emailConfirmed: false
}

export const DummyComponent = () => {
    return <div data-testid="DummyComponent">Hello world</div>;
}