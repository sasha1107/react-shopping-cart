import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { OverlayProvider } from "near-payments";
import router from "./router";
import "./index.css";
import { worker } from "@/mocks/browser";
import type { StartOptions } from "msw/browser";

const workerStartOptions: StartOptions = {
  serviceWorker: {
    url: "/react-shopping-cart/mockServiceWorker.js",
  },
};
worker.start(workerStartOptions);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OverlayProvider>
      <RouterProvider router={router} />
    </OverlayProvider>
  </React.StrictMode>
);
