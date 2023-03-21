import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const fetchList = ({ queryKey }) => {
  const heroId = queryKey[1];
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

function useSuperHeroesDetail(onSuccess, onError, id) {
  const queryClient = useQueryClient();
  return useQuery(["super-heroes", id], fetchList, {
    onSuccess,
    onError,
    initialData: () => {
      // GET ALL DATA IN CACHE
      const hero = queryClient
        .getQueryData("super-heroes")
        ?.data.find((hero) => hero.id === parseInt(id));
      if (hero) {
        return { data: hero };
      } else {
        return undefined;
      }
    },
  });
}

export default useSuperHeroesDetail;
