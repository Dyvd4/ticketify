import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotAuthorized from "./auth/NotAuthorized";
import ProtectedArea from "./auth/ProtectedArea";
import { setupErrorHandler } from "./utils/error";
import { apply as applyDarkMode } from "./utils/darkmode";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./styles/index.scss";
import "./styles/tailwind.output.css";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "./components/Navbar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient();

setupErrorHandler();
applyDarkMode();

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedArea type="route" />}>
              <Route index element={<Index />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/NotAuthorized" element={<NotAuthorized />} />
            <Route path="/Auth">
              <Route path="SignIn" element={<SignIn />} />
              <Route path="SignUp" element={<SignUp />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
