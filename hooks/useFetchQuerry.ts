import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

const endPoint = "https://pokeapi.co/api/v2";

const useFetchQuery = (path: string) => {
  return useQuery<PokemonListResponse>({
    queryKey: [path],
    queryFn: async () => {
      await wait(1);
      const res = await fetch(endPoint + path, {
        headers: {
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });
};

export default useFetchQuery;

export const useInfiniteFetchQuery = (initialPath: string) => {
  const initialUrl = endPoint + initialPath;

  return useInfiniteQuery<PokemonListResponse>({
    queryKey: [initialPath, "infinite"],
    initialPageParam: initialUrl,
    queryFn: async ({ pageParam = initialUrl }) => {
      await wait(1);
      const res = await fetch(pageParam as string, {
        headers: {
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
};

const wait = (duration: number) => {
  return new Promise<void>((resolve) =>
    setTimeout(resolve, duration * 1000)
  );
};