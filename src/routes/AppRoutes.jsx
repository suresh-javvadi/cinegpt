import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "../pages/login/Login";
import Browse from "../pages/browse/Browse";
import MovieDetail from "../pages/movieDetail/MovieDetail";
import SearchPage from "../pages/search/SearchPage";
import TrendingPage from "../pages/trending/TrendingPage";
import PersonPage from "../pages/person/PersonPage";
import NotFound from "../pages/notFound/NotFound";
import GenrePage from "../pages/genre/GenrePage";
import GptSearch from "../pages/gptSearch/GptSearch";

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
    {
      path: "/movie/:id",
      element: <MovieDetail />,
    },
    {
      path: "/search",
      element: <SearchPage />,
    },
    {
      path: "/trending",
      element: <TrendingPage />,
    },
    {
      path: "/person/:id",
      element: <PersonPage />,
    },
    {
      path: "/genre/:id/:name",
      element: <GenrePage />,
    },
    {
      path: "/gpt-search",
      element: <GptSearch />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default AppRoutes;
