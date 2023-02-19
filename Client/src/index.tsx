import { ChakraProvider, ColorModeScript, Container } from "@chakra-ui/react";
import "draft-js/dist/Draft.css";
import { Provider as AtomProvider } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "src/pages/Index/Index";
import AuthenticatedArea from "./auth/AuthenticatedArea";
import Breadcrumb from "./components/Breadcrumb";
import Navbar from "./components/Navbar";
import LoadingRipplePortalSlot from "./components/PortalSlots/LoadingRipplePortalSlot";
import Sidebar from "./components/Sidebar/Sidebar";
import theme from "./config/theme";
import Init from "./init";
import EmailConfirmed from "./pages/Auth/EmailConfirmed";
import EmailNotConfirmed from "./pages/Auth/EmailNotConfirmed/Index";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import LogIndex from "./pages/Log/Index";
import NotFound from "./pages/NotFound";
import TestIndex from "./pages/Test/Index";
import TicketDetailsIndex from "./pages/Ticket/Details/Index";
import TicketIndex from "./pages/Ticket/Index";
import UserIndex from "./pages/User/Index";
import UserSettingsIndex from "./pages/UserSettings/Index";
import "./styles/index.scss";
import "./styles/tailwind.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <Init />
    <LoadingRipplePortalSlot />
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AtomProvider>
          <Navbar />
          <Sidebar />
          <Container maxW={"container.lg"}>
            <Breadcrumb />
            <Router>
              <Routes>
                {/* authenticated or authorized */}
                <Route path="/" element={<AuthenticatedArea type="route" />}>
                  <Route index element={<Index />} />
                  <Route path="Test" element={<TestIndex />} />
                  <Route path="User" element={<UserIndex />} />
                  <Route path="UserSettings" element={<UserSettingsIndex />} />
                  <Route path="User/:id" element={<UserIndex />} />
                  <Route path="Ticket">
                    <Route index element={<TicketIndex />} />
                    <Route path="Details/:id" element={<TicketDetailsIndex />} />
                  </Route>
                  <Route path="Log" element={<LogIndex />} />
                </Route>
                <Route path="/Auth/EmailNotConfirmed" element={<AuthenticatedArea type="route" half={true} />}>
                  <Route index element={<EmailNotConfirmed />} />
                </Route>
                {/* Not authenticated or authorized */}
                <Route path="*" element={<NotFound />} />
                <Route path="/Auth">
                  <Route path="SignIn" element={<SignIn />} />
                  <Route path="SignUp" element={<SignUp />} />
                  <Route path="EmailConfirmed" element={<EmailConfirmed />} />
                </Route>
              </Routes>
            </Router>
          </Container>
        </AtomProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
