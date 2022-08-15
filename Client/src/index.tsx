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
import Todos from "./pages/Todos";
import "./styles/index.scss";
import "./styles/tailwind.output.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient();

setupErrorHandler();
applyDarkMode();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/NotAuthorized" element={<NotAuthorized />} />
          <Route path="/Auth">
            <Route path="SignIn" element={<SignIn />} />
            <Route path="SignUp" element={<SignUp />} />
          </Route>
          <Route path="/Todos" element={<ProtectedArea type="route" />}>
            <Route path="" element={<Todos />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
