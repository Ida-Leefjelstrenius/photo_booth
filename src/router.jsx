import { createBrowserRouter } from "react-router-dom";
import App from './App';
import ErrorPage from "./ErrorPage";
import FindOldPicture from "./FindOldPicture"

import Camera from "./Camera";
import { Children, Component } from "react";
import ViewPicture from "./ViewPicture";
import Display from "./Display";

const router = createBrowserRouter([
  {
    
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Camera
      },
      {
        path: "camera",
        Component: Camera,
      },
      {
        path: "view-picture",
        Component: ViewPicture,
      },
      {
        path: "display",
        Component: Display,
      },
      {
        path: "find-old-picture",
        Component: FindOldPicture,
      },
      {
        path: "*",
        Component: ErrorPage
      }]
    },
  ]);
  export default router;