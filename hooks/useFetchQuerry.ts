import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

/* =========================
   Types API
========================= */
type API = {
  "/pokemon?limit=21": {
    count: number;
    next: string | null;
    results: { name: string; url: string }[];
  };
};

type PokemonListResponse = API["/pokemon?limit=21"];

/* =========================
   Constantes
========================= */
const endPoint = "https://pokeapi.co/api/v2";

/* =========================
   Simple query
========================= */
 const useFetchQuery = <TPath extends keyof API>(path: TPath) => {
  return useQuery<PokemonListResponse>({
    queryKey: [path],
    queryFn: async () => {
      await wait(1);
      const res = await fetch(endPoint + path, {
        headers: {
          Accept: "application/json",
        },
      });
      return res.json();
    },
  });
};

export default  useFetchQuery

/* =========================
   Infinite query
========================= */
export const useInfiniteFetchQuery = <TPath extends keyof API>(path: TPath) => {
  return useInfiniteQuery<PokemonListResponse>({
    queryKey: [path],
    initialPageParam: endPoint + path,
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      await wait(1);
      const res = await fetch(pageParam, {
        headers: {
          Accept: "application/json",
        },
      });
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
};

/* =========================
   Utils
========================= */
const wait = (duration: number) => {
  return new Promise<void>((resolve) =>
    setTimeout(resolve, duration * 1000)
  );
};
