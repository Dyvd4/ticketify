import { render, screen } from "@testing-library/react";
import { useQuery } from "react-query";
import { Route, Routes } from "react-router-dom";
import { authenticatedUser, DummyComponent, fullyUnauthenticatedUser, halfUnauthenticatedUser } from "src/setupTests";
import AuthenticatedArea from "../AuthenticatedArea";
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
        <AuthenticatedArea type="area">
            Some children
        </AuthenticatedArea>
    )

    expect(screen.getByTestId("LoadingRipple")).toBeTruthy();
});
// TODO: Add proper error state
it("displays error state", () => {

    mockedUseQuery.mockImplementation(() => ({
        isError: true
    }));

    render(
        <AuthenticatedArea type="area">
            Some children
        </AuthenticatedArea>
    )

    expect(screen.getByText("An error occurred")).toBeTruthy();
});

describe("type route", () => {
    it("renders child routes when authenticated", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: authenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route path={`/${dummyRoute}`} element={<AuthenticatedArea type="route" />}>
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
                <Route path={`/${dummyRoute}`} element={<AuthenticatedArea type="route" />} />
            </Routes>
        ), `/${dummyRoute}`);

        expect(window.location.pathname).toEqual("/Auth/EmailNotConfirmed");
    });
    it("redirects to sign in page when unauthenticated", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: fullyUnauthenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route
                    path={`/${dummyRoute}`}
                    element={
                        <AuthenticatedArea
                            type="route"
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
                        <AuthenticatedArea type="area">
                            <DummyComponent />
                        </AuthenticatedArea>
                    } />
            </Routes>
        ), `/${dummyRoute}`);

        expect(screen.getByTestId("DummyComponent")).toBeTruthy();
    });
    it("doesn't display child component and restricted access component when unauthorized", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: fullyUnauthenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route
                    path={`/${dummyRoute}`}
                    element={
                        <AuthenticatedArea
                            type="area"
                            showRestrictedAccess={false}>
                            <DummyComponent />
                        </AuthenticatedArea>
                    } />
            </Routes>
        ), `/${dummyRoute}`);

        expect(screen.queryByTestId("RestrictedAccess")).not.toBeTruthy();
        expect(screen.queryByTestId("DummyComponent")).not.toBeTruthy();
    });
    it("doesn't display child component and displays restricted access component when unauthorized", () => {

        mockedUseQuery.mockImplementation(() => ({
            data: fullyUnauthenticatedUser
        }));

        renderWithRouter(() => (
            <Routes>
                <Route
                    path={`/${dummyRoute}`}
                    element={
                        <AuthenticatedArea
                            type="area">
                            <DummyComponent />
                        </AuthenticatedArea>
                    } />
            </Routes>
        ), `/${dummyRoute}`);

        expect(screen.getByTestId("RestrictedAccess")).toBeTruthy();
        expect(screen.queryByTestId("DummyComponent")).not.toBeTruthy();
    });
});