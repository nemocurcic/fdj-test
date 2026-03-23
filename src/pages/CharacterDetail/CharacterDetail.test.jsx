import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CharacterDetail from "./index";
import { mockCharacters } from "../../test/fixtures";

vi.mock("../../api/hooks", () => ({
  useCharacters: vi.fn(),
}));

import { useCharacters } from "../../api/hooks";

const renderDetail = (slug) =>
  render(
    <MemoryRouter initialEntries={[`/character/${slug}`]}>
      <Routes>
        <Route path="/character/:slug" element={<CharacterDetail />} />
      </Routes>
    </MemoryRouter>,
  );

describe("CharacterDetail", () => {
  it("shows loader while loading", () => {
    useCharacters.mockReturnValue({ isLoading: true });
    renderDetail("jon-snow");
    expect(document.querySelector(".loader")).toBeInTheDocument();
  });

  it("shows error message on failure", () => {
    useCharacters.mockReturnValue({
      error: new Error("fail"),
      isLoading: false,
    });
    renderDetail("jon-snow");
    expect(screen.getByText("Failed to load character.")).toBeInTheDocument();
  });

  it("renders nothing when slug does not match any character", () => {
    useCharacters.mockReturnValue({
      data: mockCharacters,
      isLoading: false,
    });
    const { container } = renderDetail("nobody-here");
    expect(container.querySelector(".character-detail")).not.toBeInTheDocument();
  });

  it("finds and displays the correct character by slug", () => {
    useCharacters.mockReturnValue({
      data: mockCharacters,
      isLoading: false,
    });
    renderDetail("jon-snow");

    expect(screen.getByRole("heading", { name: "Jon Snow" })).toBeInTheDocument();
    expect(screen.getByText("King in the North")).toBeInTheDocument();
    expect(screen.getByText("House Stark")).toBeInTheDocument();
  });

  it("shows family members from the same house, excluding the current character", () => {
    useCharacters.mockReturnValue({
      data: mockCharacters,
      isLoading: false,
    });
    renderDetail("jon-snow");

    expect(screen.getAllByText("Arya Stark").length).toBeGreaterThan(0);
    expect(screen.queryByText("Cersei Lannister")).not.toBeInTheDocument();
  });

  it("hides family section when no other members exist", () => {
    useCharacters.mockReturnValue({
      data: mockCharacters,
      isLoading: false,
    });
    renderDetail("cersei-lannister");

    expect(screen.queryByText(/Family .+ House Lannister/)).not.toBeInTheDocument();
  });

});
