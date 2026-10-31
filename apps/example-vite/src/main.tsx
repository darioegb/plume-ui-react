import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./styles.css";
import "plume-ui-react/tokens.css";
import "plume-ui-react/css/alert.css";
import "plume-ui-react/css/avatar.css";
import "plume-ui-react/css/badge.css";
import "plume-ui-react/css/breadcrumb.css";
import "plume-ui-react/css/button.css";
import "plume-ui-react/css/card.css";
import "plume-ui-react/css/datepicker.css";
import "plume-ui-react/css/drawer.css";
import "plume-ui-react/css/dropdown.css";
import "plume-ui-react/css/field.css";
import "plume-ui-react/css/heading.css";
import "plume-ui-react/css/input.css";
import "plume-ui-react/css/modal.css";
import "plume-ui-react/css/navbar.css";
import "plume-ui-react/css/paginator.css";
import "plume-ui-react/css/progressbar.css";
import "plume-ui-react/css/radio.css";
import "plume-ui-react/css/select.css";
import "plume-ui-react/css/sidebar.css";
import "plume-ui-react/css/skeleton.css";
import "plume-ui-react/css/table.css";
import "plume-ui-react/css/tabs.css";
import "plume-ui-react/css/text.css";
import "plume-ui-react/css/textarea.css";
import "plume-ui-react/css/toast.css";
import "./i18n";
import { App } from "./app";
import { Providers } from "./providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Providers>
  </StrictMode>,
);
