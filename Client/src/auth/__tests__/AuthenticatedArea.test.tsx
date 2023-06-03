import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { useQuery } from "react-query";
import { Route, Routes } from "react-router-dom";
import {
	authenticatedUser,
	DummyComponent,
	fullyUnauthenticatedUser,
	halfUnauthenticatedUser,
} from "src/setupTests";
import { Mock, vi } from "vitest";
import AuthenticatedArea from "../AuthenticatedArea";

vi.mock("react-query", () => ({
	useQuery: vi.fn(),
}));

const mockedUseQuery = useQuery as Mock<any>;
const dummyRoute = "dummyRoute";
const dummySubroute = "subRoute";

afterEach(cleanup);

it("displays loading state", () => {
	mockedUseQuery.mockImplementation(() => ({
		isLoading: true,
	}));

	render(<AuthenticatedArea type="area">Some children</AuthenticatedArea>);

	expect(screen.getByTestId("LoadingRipple")).toBeTruthy();
});

it("displays error state", () => {
	mockedUseQuery.mockImplementation(() => ({
		isError: true,
	}));

	render(<AuthenticatedArea type="area">Some children</AuthenticatedArea>);

	expect(
		screen.getByText("We're sorry but it seems that an error occurred during your request.")
	).toBeTruthy();
});

describe("type route", () => {
	it("renders child routes when authenticated", () => {
		mockedUseQuery.mockImplementation(() => ({
			data: authenticatedUser,
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route path={`/${dummyRoute}`} element={<AuthenticatedArea type="route" />}>
						<Route path={dummySubroute} element={<DummyComponent />} />
					</Route>
				</Routes>
			),
			`/${dummyRoute}/${dummySubroute}`
		);

		expect(screen.getByTestId("DummyComponent")).toBeTruthy();
	});
	it("renders child routes when authorized", () => {
		mockedUseQuery.mockImplementation(() => ({
			data: {
				...authenticatedUser,
				role: {
					name: "admin",
				},
			},
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route
						path={`/${dummyRoute}`}
						element={<AuthenticatedArea roleName={"customer"} type="route" />}
					>
						<Route path={dummySubroute} element={<DummyComponent />} />
					</Route>
				</Routes>
			),
			`/${dummyRoute}/${dummySubroute}`
		);

		waitFor(() => {
			expect(screen.getByTestId("DummyComponent")).toBeTruthy();
		});
		cleanup();

		mockedUseQuery.mockImplementation(() => ({
			data: {
				...authenticatedUser,
				role: {
					name: "customer",
				},
			},
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route
						path={`/${dummyRoute}`}
						element={<AuthenticatedArea roleName={"customer"} type="route" />}
					>
						<Route path={dummySubroute} element={<DummyComponent />} />
					</Route>
				</Routes>
			),
			`/${dummyRoute}/${dummySubroute}`
		);

		waitFor(() => {
			expect(screen.getByTestId("DummyComponent")).toBeTruthy();
		});
		cleanup();

		mockedUseQuery.mockImplementation(() => ({
			data: {
				...authenticatedUser,
				role: {
					name: "super-admin",
				},
			},
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route
						path={`/${dummyRoute}`}
						element={<AuthenticatedArea roleName={"customer"} type="route" />}
					>
						<Route path={dummySubroute} element={<DummyComponent />} />
					</Route>
				</Routes>
			),
			`/${dummyRoute}/${dummySubroute}`
		);

		waitFor(() => {
			expect(screen.getByTestId("DummyComponent")).toBeTruthy();
		});
	});
	it("redirects to email confirmation page when user's email is not confirmed yet", () => {
		mockedUseQuery.mockImplementation(() => ({
			data: halfUnauthenticatedUser,
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route path={`/${dummyRoute}`} element={<AuthenticatedArea type="route" />} />
				</Routes>
			),
			`/${dummyRoute}`
		);

		expect(window.location.pathname).toEqual("/Auth/EmailNotConfirmed");
	});
	it("doesn't redirect to email confirmation page when user's email is not confirmed yet", () => {
		mockedUseQuery.mockImplementation(() => ({
			data: halfUnauthenticatedUser,
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route
						path={`/${dummyRoute}`}
						element={<AuthenticatedArea type="route" ignoreEmailConfirmation={true} />}
					/>
				</Routes>
			),
			`/${dummyRoute}`
		);

		expect(window.location.pathname).toEqual(`/${dummyRoute}`);
	});
	it("redirects to sign in page when unauthenticated", () => {
		mockedUseQuery.mockImplementation(() => ({
			data: fullyUnauthenticatedUser,
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route path={`/${dummyRoute}`} element={<AuthenticatedArea type="route" />} />
				</Routes>
			),
			`/${dummyRoute}`
		);

		expect(window.location.pathname).toEqual("/Auth/SignIn");
	});
	it("redirects to restricted access page when unauthorized", () => {
		mockedUseQuery.mockImplementation(() => ({
			data: {
				...authenticatedUser,
				role: {
					name: "dummy-role",
				},
			},
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route
						path={`/${dummyRoute}`}
						element={<AuthenticatedArea roleName={"customer"} type="route" />}
					/>
				</Routes>
			),
			`/${dummyRoute}`
		);

		expect(window.location.pathname).toEqual("/RestrictedAccess");
		cleanup();

		mockedUseQuery.mockImplementation(() => ({
			data: {
				...authenticatedUser,
				role: "",
			},
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route
						path={`/${dummyRoute}`}
						element={<AuthenticatedArea roleName={"customer"} type="route" />}
					/>
				</Routes>
			),
			`/${dummyRoute}`
		);

		expect(window.location.pathname).toEqual("/RestrictedAccess");
		cleanup();

		mockedUseQuery.mockImplementation(() => ({
			data: {
				...authenticatedUser,
				role: "admin",
			},
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route
						path={`/${dummyRoute}`}
						element={<AuthenticatedArea roleName={"super-admin"} type="route" />}
					/>
				</Routes>
			),
			`/${dummyRoute}`
		);

		expect(window.location.pathname).toEqual("/RestrictedAccess");
	});
});

describe("type area", () => {
	it("displays children when authorized", () => {
		mockedUseQuery.mockImplementation(() => ({
			data: authenticatedUser,
		}));

		renderWithRouter(
			() => (
				<Routes>
					<Route
						path={`/${dummyRoute}`}
						element={
							<AuthenticatedArea type="area">
								<DummyComponent />
							</AuthenticatedArea>
						}
					/>
				</Routes>
			),
			`/${dummyRoute}`
		);

		expect(screen.getByTestId("DummyComponent")).toBeTruthy();
	});
});
