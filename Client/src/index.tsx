import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import "draft-js/dist/Draft.css";
import { Provider as AtomProvider } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "src/pages/Index/Index";
import AuthenticatedArea from "./auth/AuthenticatedArea";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import theme from "./config/theme";
import Init from "./init";
import EmailConfirmed from "./pages/Auth/EmailConfirmed";
import EmailNotConfirmed from "./pages/Auth/EmailNotConfirmed";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import LogIndex from "./pages/Log/Index";
import NotFound from "./pages/NotFound";
import TestIndex from "./pages/Test/Index";
import TicketDetailsIndex from "./pages/Ticket/Details/Index";
import TicketIndex from "./pages/Ticket/Index";
import UserIndex from "./pages/User/Index";
import "./styles/index.scss";
import "./styles/tailwind.output.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <Init />
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AtomProvider>
          <Navbar />
          <Sidebar />
          <Router>
            <Routes>
              {/* authenticated or authorized */}
              <Route path="/" element={<AuthenticatedArea type="route" />}>
                <Route index element={<Index />} />
                <Route path="Test" element={<TestIndex />} />
                <Route path="User" element={<UserIndex />} />
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
        </AtomProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
