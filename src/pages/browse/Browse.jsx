import React, { useEffect } from "react";
import Header from "../../components/Header";
import useNowPlayingMovies from "../../hooks/useNowPlayingMovies";
import TopContainer from "./topContainer";
import SecondaryContainer from "./SecondaryContainer";

const Browse = () => {
  useNowPlayingMovies();

  return (
    <div>
      <Header />
      <TopContainer />
      <SecondaryContainer />
    </div>
  );
};

export default Browse;
