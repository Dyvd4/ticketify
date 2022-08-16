import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotAuthorized from "./auth/NotAuthorized";
import ProtectedArea from "./auth/ProtectedArea";
import Navbar from "./components/Navbar";
import { themeConfig } from "./config/theme";
import Init from "./init";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./styles/index.scss";
import "./styles/tailwind.output.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient();
const theme = extendTheme(themeConfig);

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <Init />
    <ChakraProvider theme={theme}>
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
