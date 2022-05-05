import { useEffect } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useParams } from "react-router";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { Rounds } from "./@types";

import App from "./App";
import { homeUrl } from "./util/game";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOMClient.createRoot(rootElement);

function Wrapper() {
  return <Outlet />;
}

function Router() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);

  const challengerStringData = searchParams.get("challengerGameData");
  const challengerGameData = challengerStringData
    ? (JSON.parse(challengerStringData) as Rounds)
    : null;
  const wordIndex = searchParams.get("wordIndex")
    ? parseInt(searchParams.get("wordIndex") ?? "")
    : null;
  console.log("params", params, location, challengerGameData, wordIndex);

  return useRoutes([
    {
      path: homeUrl,
      element: <Wrapper />,
      children: [
        { element: <Navigate to="/home" replace /> },
        {
          path: homeUrl,
          element: (
            <App challengerData={challengerGameData} wordIndex={wordIndex} />
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
