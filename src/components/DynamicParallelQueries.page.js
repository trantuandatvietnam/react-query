import axios from "axios";
import React from "react";
import { useQueries } from "react-query";

const fetchSuperHeroes = (heroId) => {
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

function DynamicParallelQueries({ heroeIds }) {
  const queryResults = useQueries(
    heroeIds.map((id) => {
      return {
        queryKey: ["super-hero", id],
        queryFn: () => fetchSuperHeroes(id),
      };
    })
  );
  console.log(queryResults);
  return <div>DynamicParallelQueries</div>;
}

export default DynamicParallelQueries;
