import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCharacters } from "../../api/hooks";
import CharacterCard from "../../components/CharacterCard";
import FamilyFilter from "../../components/FamilyFilter";
import Loader from "../../components/Loader";
import "./styles.css";

const CharacterList = () => {
  const { data: characters, isLoading, error } = useCharacters();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFamily = searchParams.get("family") || "";

  const handleFamilyChange = (value) => {
    setSearchParams(value ? { family: value } : {}, { replace: true });
  };

  const families = useMemo(() => {
    if (!characters) return [];
    const unique = [...new Set(characters.map((c) => c.family).filter(Boolean))];
    return unique.sort();
  }, [characters]);

  const filtered = useMemo(() => {
    if (!characters) return [];
    if (!selectedFamily) return characters;
    return characters.filter((c) => c.family === selectedFamily);
  }, [characters, selectedFamily]);

  if (isLoading) return <Loader />;
  if (error) return <p className="error">Failed to load characters.</p>;

  return (
    <div className="character-list">
      <div className="character-list__header">
        <h1 className="character-list__title">Game of Thrones Families</h1>
        <FamilyFilter
          families={families}
          selected={selectedFamily}
          onChange={handleFamilyChange}
        />
      </div>
      <div className="character-list__grid">
        {filtered.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};

export default CharacterList;
