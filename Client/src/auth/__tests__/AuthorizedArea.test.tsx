import { render, screen } from "@testing-library/react";
import { useQuery } from "react-query";
import { Route, Routes } from "react-router-dom";
import { authenticatedUser, DummyComponent, halfUnauthenticatedUser } from "src/setupTests";
import AuthorizedArea from "../AuthorizedArea";
import { Mock, vi } from "vitest"

vi.mock("react-query", () => ({
    useQuery: vi.fn()
}));

const mockedUseQuery = useQuery as Mock<any>
const dummyRoute = "dummyRoute";
const dummySubroute = "subRoute";

it("displays loading state", () => {

    mockedUseQuery.mockImplementation(() => ({
        isLoading: true
    }));

    render(
        <AuthorizedArea type="area">
            Some children
        </AuthorizedArea>
    )

    expect(screen.getByTestId("LoadingRipple")).toBeTruthy();
});
// TODO: Add proper error state
it("displays error state", () => {

    mockedUseQuery.mockImplementation(() => ({
        isError: true
    }));

    render(
        <AuthorizedArea type="area">
            Some children
        </AuthorizedArea>
    )

    expect(screen.getByText("An error occurred")).toBeTruthy();
});

describe("type route", () => {
    it("renders child routes when authorized", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: authenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route path={`/${dummyRoute}`} element={<AuthorizedArea type="route" />}>
                    <Route path={dummySubroute} element={<DummyComponent />} />
                </Route>
            </Routes>
        ), `/${dummyRoute}/${dummySubroute}`);

        expect(screen.getByTestId("DummyComponent")).toBeTruthy();
    });
    it("redirects to email confirmation page when user's email is not confirmed yet", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: halfUnauthenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route path={`/${dummyRoute}`} element={<AuthorizedArea type="route" />} />
            </Routes>
        ), `/${dummyRoute}`);

        expect(window.location.pathname).toEqual("/Auth/EmailNotConfirmed");
    });
    it("redirects to sign in page when unauthorized", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: authenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route
                    path={`/${dummyRoute}`}
                    element={
                        <AuthorizedArea
                            type="route"
                            authorizationStrategy={(user) => user.username === "Hanswurst"}
                        />
                    } />
            </Routes>
        ), `/${dummyRoute}`);

        expect(window.location.pathname).toEqual("/Auth/SignIn");
    });
});

describe("type area", () => {
    it("displays children when authorized", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: authenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route
                    path={`/${dummyRoute}`}
                    element={
                        <AuthorizedArea type="area">
                            <DummyComponent />
                        </AuthorizedArea>
                    } />
            </Routes>
        ), `/${dummyRoute}`);

        expect(screen.getByTestId("DummyComponent")).toBeTruthy();
    });
    it("doesn't display child component and restricted access component when unauthorized", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: authenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route
                    path={`/${dummyRoute}`}
                    element={
                        <AuthorizedArea
                            type="area"
                            showRestrictedAccess={false}
                            authorizationStrategy={(user) => user.username === "Hanswurst"}>
                            <DummyComponent />
                        </AuthorizedArea>
                    } />
            </Routes>
        ), `/${dummyRoute}`);

        expect(screen.queryByTestId("RestrictedAccess")).not.toBeTruthy();
        expect(screen.queryByTestId("DummyComponent")).not.toBeTruthy();
    });
    it("doesn't display child component and displays restricted access component when unauthorized", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: authenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route
                    path={`/${dummyRoute}`}
                    element={
                        <AuthorizedArea
                            type="area"
                            authorizationStrategy={(user) => user.username === "Hanswurst"}>
                            <DummyComponent />
                        </AuthorizedArea>
                    } />
            </Routes>
        ), `/${dummyRoute}`);

        expect(screen.getByTestId("RestrictedAccess")).toBeTruthy();
        expect(screen.queryByTestId("DummyComponent")).not.toBeTruthy();
    });
});