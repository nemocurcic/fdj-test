export const toSlug = (character) =>
  `${character.firstName}-${character.lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
