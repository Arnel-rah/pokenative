import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const endPoint = "https://pokeapi.co/api/v2";
const useFetchQuery = (path: string) => {
  return useQuery({
    queryKey: [path],
    queryFn: async () => {
        await wait(1)
        return fetch(endPoint + path).then(r => r.json());
    },
  });
};

const useInfiniteFetchQuery = (path: string) => {
  return useInfiniteQuery({
    queryKey: [path],
    initialPageParam: endPoint + path,
    queryFn: async ({pageParam}) => {
        await wait(1)
        return fetch(pageParam, {
          headers: {
            Accept: 'application/json'
          }
        }).then(r => r.json())},
        getNextPageParam: (lastPage) => {
          if ("next" in lastPage) {
            return lastPage.next
          }
          return null
        }
  })

}

const wait = (duration: number) => {
    return new Promise(resolve => setTimeout(resolve, duration * 1000));

}

export default useFetchQuery; useInfiniteFetchQuery
