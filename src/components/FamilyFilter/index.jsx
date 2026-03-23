import { useState, useRef, useEffect, useCallback } from "react";
import "./styles.css";

const FamilyFilter = ({ families, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const label = selected || "All families";

  const handleSelect = (value) => {
    onChange(value);
    setOpen(false);
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      const items = listRef.current?.querySelectorAll("[role='option']");
      if (!items?.length) return;

      const focused = listRef.current.querySelector("[data-focused='true']");
      const arr = Array.from(items);
      const idx = focused ? arr.indexOf(focused) : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = idx < arr.length - 1 ? idx + 1 : 0;
        arr.forEach((el, i) => el.setAttribute("data-focused", i === next));
        arr[next].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = idx > 0 ? idx - 1 : arr.length - 1;
        arr.forEach((el, i) => el.setAttribute("data-focused", i === prev));
        arr[prev].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focused) focused.click();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    },
    [open]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="family-filter" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        className="family-filter__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="family-filter__label">{label}</span>
        <span className={`family-filter__chevron ${open ? "family-filter__chevron--open" : ""}`}>
          &#9662;
        </span>
      </button>

      {open && (
        <ul className="family-filter__list" role="listbox" ref={listRef}>
          <li
            className={`family-filter__option ${selected === "" ? "family-filter__option--active" : ""}`}
            role="option"
            aria-selected={selected === ""}
            onClick={() => handleSelect("")}
          >
            All families
          </li>
          {families.map((family) => (
            <li
              key={family}
              className={`family-filter__option ${selected === family ? "family-filter__option--active" : ""}`}
              role="option"
              aria-selected={selected === family}
              onClick={() => handleSelect(family)}
            >
              {family}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FamilyFilter;
