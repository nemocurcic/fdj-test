import { useQuery } from "@tanstack/react-query";
import { fetchCharacters } from "./thronesApi";

export const useCharacters = () =>
  useQuery({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
    staleTime: 5 * 60 * 1000,
  });
