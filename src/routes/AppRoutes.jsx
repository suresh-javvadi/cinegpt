import React from "react";
import { createBrowserRouter, RouterProvider, ScrollRestoration } from "react-router";
import Login from "../pages/login/Login";
import Browse from "../pages/browse/Browse";
import MovieDetail from "../pages/movieDetail/MovieDetail";
import SearchPage from "../pages/search/SearchPage";
import TrendingPage from "../pages/trending/TrendingPage";
import PersonPage from "../pages/person/PersonPage";
import NotFound from "../pages/notFound/NotFound";
import GenrePage from "../pages/genre/GenrePage";
import GptSearch from "../pages/gptSearch/GptSearch";

const Layout = ({ children }) => (
  <>
    <ScrollRestoration />
    {children}
  </>
);

const AppRoutes = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Layout><Login /></Layout>,
    },
    {
      path: "/browse",
      element: <Layout><Browse /></Layout>,
    },
    {
      path: "/movie/:id",
      element: <Layout><MovieDetail /></Layout>,
    },
    {
      path: "/search",
      element: <Layout><SearchPage /></Layout>,
    },
    {
      path: "/trending",
      element: <Layout><TrendingPage /></Layout>,
    },
    {
      path: "/person/:id",
      element: <Layout><PersonPage /></Layout>,
    },
    {
      path: "/genre/:id/:name",
      element: <Layout><GenrePage /></Layout>,
    },
    {
      path: "/gpt-search",
      element: <Layout><GptSearch /></Layout>,
    },
    {
      path: "*",
      element: <Layout><NotFound /></Layout>,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default AppRoutes;
