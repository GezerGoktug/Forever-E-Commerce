import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.scss";
import { BrowserRouter } from "react-router-dom";
import ScrollTop from "./ScrollTop.tsx";
import QueryClientProvider from "./providers/QueryClientProvider.tsx";
import { ThemeProvider } from "@forever/theme-kit"

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider>
    <BrowserRouter>
      <ScrollTop>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ScrollTop>
    </BrowserRouter>
  </QueryClientProvider>
);
