import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "../pages/login/Login";
import Browse from "../pages/browse/Browse";

const AppRoutes = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default AppRoutes;
