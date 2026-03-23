import { useState } from "react";
import { Link } from "react-router-dom";
import { toSlug } from "../../utils/slug";
import "./styles.css";

const CharacterCard = ({ character }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`/character/${toSlug(character)}`}
      className={`character-card ${loaded ? "character-card--loaded" : ""}`}
    >
      <img
        src={character.imageUrl}
        alt={character.fullName}
        className="character-card__image"
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      <div className="character-card__overlay">
        <span className="character-card__name">{character.fullName}</span>
      </div>
    </Link>
  );
};

export default CharacterCard;
