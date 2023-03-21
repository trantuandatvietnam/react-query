// import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { request } from "../utils/axios-utils";

const fetchList = () => {
  // return axios.get("http://localhost:4000/superheroes");
  return request({ url: "/superheroes" });
};

function useSuperHeroesData(onSuccess, onError) {
  return useQuery("super-heroes", fetchList, {
    onSuccess,
    onError,
  });
}

const addSuperHero = (hero) => {
  // return axios.post("http://localhost:4000/superheroes", hero);
  return request({ url: "/superheroes", method: "post", data: hero });
};

export const useAddSuperHeroData = () => {
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    // `newHero` chính là hero trong hàm `addSuperHero`
    onMutate: async (newHero) => {
      // Cancel get all
      await queryClient.cancelQueries("super-heroes");
      const previousHeroData = queryClient.getQueryData("super-heroes");
      queryClient.setQueryData("super-heroes", (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [
            ...oldQueryData.data,
            {
              id: oldQueryData?.data?.length + 1,
              ...newHero,
            },
          ],
        };
      });
      return {
        previousHeroData,
      };
    },
    onError: (_error, _hero, context) => {
      queryClient.setQueryData("super-heroes", context.previousHeroData);
    },
    // luôn chạy dù thành công hay thất bại
    onSettled: () => {
      queryClient.invalidateQueries("super-heroes");
    },
  });
};

export default useSuperHeroesData;
