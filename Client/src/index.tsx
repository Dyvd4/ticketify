import "./styles/index.scss";
import "./styles/tailwind.scss";
import "draft-js/dist/Draft.css";
import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Provider as AtomProvider } from "jotai";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthenticatedArea from "./auth/AuthenticatedArea";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import PortalSlot from "./components/Slots/PortalSlot";
import theme from "./config/theme";
import Init from "./init";
import LoadingRipple from "./components/Loading/LoadingRipple";
import PagePortalSlot from "./components/Slots/PagePortalSlot";
const UserIndex = lazy(() => import("./pages/User/Index"));
const Index = lazy(() => import("src/pages/Index/Index"));
const EmailConfirmed = lazy(() => import("./pages/Auth/EmailConfirmed"));
const EmailNotConfirmed = lazy(() => import("./pages/Auth/EmailNotConfirmed"));
const SignIn = lazy(() => import("./pages/Auth/SignIn"));
const SignUp = lazy(() => import("./pages/Auth/SignUp"));
const LogIndex = lazy(() => import("./pages/Log/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TestIndex = lazy(() => import("./pages/Test/Index"));
const TicketDetailsIndex = lazy(() => import("./pages/Ticket/Details/Index"));
const TicketIndex = lazy(() => import("./pages/Ticket/Index"));
const UserDetailsIndex = lazy(() => import("./pages/User/Details/Index"));
const UserSettingsIndex = lazy(() => import("./pages/UserSettings/Index"));
const RoleManagementIndex = lazy(() => import("./pages/RoleManagement/Index"));
const CompanyIndex = lazy(() => import("./pages/Company/Index"));
const CompanyDetailsIndex = lazy(() => import("./pages/Company/Details/Index"));

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60000,
		},
	},
});

root.render(
	<React.StrictMode>
		<AtomProvider>
			<ColorModeScript />
			<Init />
			<PortalSlot />
			<ChakraProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<AuthenticatedArea>
						<Navbar />
						<Sidebar />
					</AuthenticatedArea>
					<Box id="container" className="p-4">
						<PagePortalSlot />
						<Router>
							<Routes>
								{/* authenticated or authorized */}
								<Route path="/" element={<AuthenticatedArea type="route" />}>
									<Route
										index
										element={
											<Suspense fallback={<LoadingRipple />}>
												<Index />
											</Suspense>
										}
									/>
									<Route
										path="Test"
										element={
											<Suspense fallback={<LoadingRipple />}>
												<TestIndex />
											</Suspense>
										}
									/>
									<Route
										path="User"
										element={
											<Suspense fallback={<LoadingRipple />}>
												<UserIndex />
											</Suspense>
										}
									/>
									<Route
										path="User/:id"
										element={
											<Suspense fallback={<LoadingRipple />}>
												<UserDetailsIndex />
											</Suspense>
										}
									/>
									<Route
										path="UserSettings"
										element={
											<Suspense fallback={<LoadingRipple />}>
												<UserSettingsIndex />
											</Suspense>
										}
									/>
									<Route path="Ticket">
										<Route
											index
											element={
												<Suspense fallback={<LoadingRipple />}>
													<TicketIndex />
												</Suspense>
											}
										/>
										<Route
											path="Details/:id"
											element={
												<Suspense fallback={<LoadingRipple />}>
													<TicketDetailsIndex />
												</Suspense>
											}
										/>
									</Route>
									<Route
										path="Log"
										element={
											<Suspense fallback={<LoadingRipple />}>
												<LogIndex />
											</Suspense>
										}
									/>
									<Route path="Company">
										<Route
											index
											element={
												<Suspense fallback={<LoadingRipple />}>
													<CompanyIndex />
												</Suspense>
											}
										/>
										<Route
											path="Details/:id"
											element={
												<Suspense fallback={<LoadingRipple />}>
													<CompanyDetailsIndex />
												</Suspense>
											}
										/>
									</Route>
								</Route>
								<Route
									path="/RoleManagement"
									element={<AuthenticatedArea type="route" roleName={"admin"} />}
								>
									<Route
										index
										element={
											<Suspense fallback={<LoadingRipple />}>
												<RoleManagementIndex />
											</Suspense>
										}
									/>
								</Route>
								<Route
									path="/Auth/EmailNotConfirmed"
									element={
										<AuthenticatedArea
											type="route"
											ignoreEmailConfirmation={true}
										/>
									}
								>
									<Route index element={<EmailNotConfirmed />} />
								</Route>
								{/* Not authenticated or authorized */}
								<Route
									path="*"
									element={
										<Suspense fallback={<LoadingRipple />}>
											<NotFound />
										</Suspense>
									}
								/>
								<Route path="/Auth">
									<Route
										path="SignIn"
										element={
											<Suspense fallback={<LoadingRipple />}>
												<SignIn />
											</Suspense>
										}
									/>
									<Route
										path="SignUp"
										element={
											<Suspense fallback={<LoadingRipple />}>
												<SignUp />
											</Suspense>
										}
									/>
									<Route
										path="EmailConfirmed"
										element={
											<Suspense fallback={<LoadingRipple />}>
												<EmailConfirmed />
											</Suspense>
										}
									/>
								</Route>
							</Routes>
						</Router>
					</Box>
				</QueryClientProvider>
			</ChakraProvider>
		</AtomProvider>
	</React.StrictMode>
);
