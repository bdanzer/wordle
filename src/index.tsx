import { useState } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useParams } from "react-router";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { Rounds } from "./@types";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import App from "./App";
import { getOfficialWord, getRandomWord } from "./util/game";
import { urlPath } from "./util/routing";
import { WordleProvider } from "./contexts/WordleProvider";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOMClient.createRoot(rootElement);

function Wrapper() {
  return <Outlet />;
}

function Router() {
  const isFirstTime = !localStorage.getItem("hasPlayed");

  return useRoutes([
    {
      path: urlPath(),
      element: <Wrapper />,
      children: [
        // { element: <Navigate to="/home" replace /> },
        {
          path: urlPath(),
          element: (
            <WordleProvider>
              <App isFirstTime={isFirstTime} />
            </WordleProvider>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <Outlet />,
      children: [{ element: <Navigate to="home" replace /> }],
    },
  ]);
}

root.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
