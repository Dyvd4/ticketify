import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { Provider as AtomProvider } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "src/pages/Index/Index";
import NotAuthorized from "./auth/NotAuthorized";
import ProtectedArea from "./auth/ProtectedArea";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { themeConfig } from "./config/theme";
import Init from "./init";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
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
        <AtomProvider>
          <Navbar />
          <Sidebar />
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
        </AtomProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
