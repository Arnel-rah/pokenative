import { useQuery } from "@tanstack/react-query";

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

const wait = (duration: number) => {
    return new Promise(resolve => setTimeout(resolve, duration * 1000));

}

export default useFetchQuery;