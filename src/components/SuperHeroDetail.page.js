import React from "react";
import { useParams } from "react-router-dom";
import useSuperHeroesDetail from "../hooks/useSuperHeroDetail";

function SuperHeroDetailPage() {
  const { id } = useParams();
  const onSuccess = (data) => {
    console.log("Update successfully", data);
  };
  const onError = (error) => {
    console.log("Update fail", error);
  };
  const response = useSuperHeroesDetail(onSuccess, onError, id);
  const { data, isLoading, isError, error } = response;

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>{error.message}</h2>;
  return <div>{data.data.name}</div>;
}

export default SuperHeroDetailPage;
