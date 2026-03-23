import { useRef, useState, useEffect, useCallback } from "react";
import CharacterCard from "../CharacterCard";
import "./styles.css";

const FamilySlider = ({ members }) => {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, members]);

  const scroll = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  const maskClass = [
    "family-slider__mask",
    canScrollLeft ? "family-slider__mask--left" : "",
    canScrollRight ? "family-slider__mask--right" : "",
  ].join(" ");

  console.log(maskClass);

  return (
    <div className="family-slider">
      {canScrollLeft && (
        <button
          className="family-slider__arrow family-slider__arrow--left"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          &#8249;
        </button>
      )}

      <div className={maskClass}>
        <div className="family-slider__track" ref={trackRef}>
          {members.map((member) => (
            <div className="family-slider__slide" key={member.id}>
              <CharacterCard character={member} />
            </div>
          ))}
        </div>
      </div>

      {canScrollRight && (
        <button
          className="family-slider__arrow family-slider__arrow--right"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          &#8250;
        </button>
      )}
    </div>
  );
};

export default FamilySlider;
