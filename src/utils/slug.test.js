import { describe, it, expect } from "vitest";
import { toSlug } from "./slug";

describe("toSlug", () => {
  it("generates a lowercase slug from firstName and lastName", () => {
    expect(toSlug({ firstName: "Jon", lastName: "Snow" })).toBe("jon-snow");
  });

  it("handles multi-word names", () => {
    expect(toSlug({ firstName: "Daenerys", lastName: "Targaryen" })).toBe(
      "daenerys-targaryen",
    );
  });

  it("strips special characters", () => {
    expect(toSlug({ firstName: "Joffrey", lastName: "Baratheon'" })).toBe(
      "joffrey-baratheon",
    );
  });

  it("collapses consecutive hyphens", () => {
    expect(toSlug({ firstName: "The", lastName: "Hound--Dog" })).toBe(
      "the-hound-dog",
    );
  });

  it("handles empty lastName", () => {
    expect(toSlug({ firstName: "Hodor", lastName: "" })).toBe("hodor-");
  });

  it("handles empty firstName", () => {
    expect(toSlug({ firstName: "", lastName: "Stark" })).toBe("-stark");
  });
});
