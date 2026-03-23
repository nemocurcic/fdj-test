import { useParams, useNavigate } from "react-router-dom";
import { useCharacters } from "../../api/hooks";
import { toSlug } from "../../utils/slug";
import CharacterCard from "../../components/CharacterCard";
import FamilySlider from "../../components/FamilySlider";
import Loader from "../../components/Loader";
import "./styles.css";

const CharacterDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: allCharacters, isLoading, error } = useCharacters();

  const character = allCharacters?.find((c) => toSlug(c) === slug);

  const familyMembers = allCharacters?.filter(
    (c) => c.family === character?.family && c.id !== character?.id,
  );

  if (isLoading) return <Loader />;
  if (error) return <p className="error">Failed to load character.</p>;
  if (!character) return null;

  return (
    <div className="character-detail">
      <button className="character-detail__back" onClick={() => navigate(-1)}>
        <span className="character-detail__back-icon">&#8249;</span> Back to all
        characters
      </button>

      <div className="character-detail__hero">
        <h1 className="character-detail__name">{character.fullName}</h1>
        <img
          src={character.imageUrl}
          alt={character.fullName}
          className="character-detail__image"
        />
        <div className="character-detail__info">
          <dl className="character-detail__fields">
            <dt>First Name</dt>
            <dd>{character.firstName}</dd>
            <dt>Last Name</dt>
            <dd>{character.lastName}</dd>
            <dt>Full Name</dt>
            <dd>{character.fullName}</dd>
            <dt>Title</dt>
            <dd>{character.title}</dd>
            <dt>Family</dt>
            <dd>{character.family}</dd>
          </dl>
        </div>
      </div>

      {familyMembers && familyMembers.length > 0 && (
        <section className="character-detail__family">
          <h2 className="character-detail__family-title">
            Family &ndash; {character.family}
          </h2>
          <div className="character-detail__family-grid">
            {familyMembers.map((member) => (
              <CharacterCard key={member.id} character={member} />
            ))}
          </div>
          <div className="character-detail__family-slider">
            <FamilySlider members={familyMembers} />
          </div>
        </section>
      )}
    </div>
  );
};

export default CharacterDetail;
