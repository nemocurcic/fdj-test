import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CharacterList from "./index";
import { mockCharacters } from "../../test/fixtures";

vi.mock("../../api/hooks", () => ({
  useCharacters: vi.fn(),
}));

import { useCharacters } from "../../api/hooks";

const renderList = () =>
  render(
    <MemoryRouter>
      <CharacterList />
    </MemoryRouter>,
  );

describe("CharacterList", () => {
  it("shows loader while loading", () => {
    useCharacters.mockReturnValue({ isLoading: true });
    renderList();
    expect(document.querySelector(".loader")).toBeInTheDocument();
  });

  it("shows error message on failure", () => {
    useCharacters.mockReturnValue({
      error: new Error("fail"),
      isLoading: false,
    });
    renderList();
    expect(screen.getByText("Failed to load characters.")).toBeInTheDocument();
  });

  it("filters characters by selected family", async () => {
    const user = userEvent.setup();
    useCharacters.mockReturnValue({
      data: mockCharacters,
      isLoading: false,
    });
    renderList();

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "House Stark" }));

    expect(screen.getByText("Jon Snow")).toBeInTheDocument();
    expect(screen.getByText("Arya Stark")).toBeInTheDocument();
    expect(screen.queryByText("Cersei Lannister")).not.toBeInTheDocument();
    expect(screen.queryByText("Hodor")).not.toBeInTheDocument();
  });

  it("shows all characters again when filter is cleared", async () => {
    const user = userEvent.setup();
    useCharacters.mockReturnValue({
      data: mockCharacters,
      isLoading: false,
    });
    renderList();

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("option", { name: "House Lannister" }));
    expect(screen.queryByText("Jon Snow")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));
    const allOption = screen
      .getAllByText("All families")
      .find((el) => el.getAttribute("role") === "option");
    await user.click(allOption);

    expect(screen.getByText("Jon Snow")).toBeInTheDocument();
    expect(screen.getByText("Cersei Lannister")).toBeInTheDocument();
  });
});
