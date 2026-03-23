const BASE_URL = "https://thronesapi.com/api/v2";

export const fetchCharacters = async () => {
  const response = await fetch(`${BASE_URL}/Characters`);
  if (!response.ok) throw new Error("Failed to fetch characters");
  return response.json();
};

