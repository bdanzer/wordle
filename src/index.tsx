import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router-dom";

import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

function Routes() {
  return useRoutes([
    {
      path: "/",
      element: <App />
    }
  ]);
}

root.render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
);
