import { createBrowserRouter } from "react-router-dom";
import App from './App';
import ErrorPage from "./ErrorPage";

import Camera from "./Camera";
import { Children, Component } from "react";
import ViewPictures from "./ViewPictures";

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
        path: "view-pictures",
        Component: ViewPictures,
      },
      {
        path: "*",
        Component: ErrorPage
      }]
    },
]);
export default router;