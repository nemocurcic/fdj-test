import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FamilyFilter from "./index";

const families = ["House Stark", "House Lannister", "House Targaryen"];

const renderFilter = (props = {}) =>
  render(
    <FamilyFilter
      families={families}
      selected=""
      onChange={vi.fn()}
      {...props}
    />,
  );

describe("FamilyFilter", () => {
  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    renderFilter();

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(families.length + 1);
  });

  it("calls onChange with the selected family", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderFilter({ onChange });

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("House Lannister"));

    expect(onChange).toHaveBeenCalledWith("House Lannister");
  });

  it('calls onChange with empty string when "All families" is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderFilter({ selected: "House Stark", onChange });

    await user.click(screen.getByRole("button"));

    const allOptions = screen.getAllByText("All families");
    const listOption = allOptions.find(
      (el) => el.getAttribute("role") === "option",
    );
    await user.click(listOption);

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    renderFilter();

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens on Enter when trigger is focused", async () => {
    const user = userEvent.setup();
    renderFilter();

    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("navigates options with ArrowDown and selects with Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderFilter({ onChange });

    await user.click(screen.getByRole("button"));

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith("House Stark");
  });

  it("marks the active option with aria-selected", async () => {
    const user = userEvent.setup();
    renderFilter({ selected: "House Targaryen" });

    await user.click(screen.getByRole("button"));

    const active = screen.getByRole("option", { name: "House Targaryen" });
    expect(active).toHaveAttribute("aria-selected", "true");
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();
    renderFilter();

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("sets aria-expanded correctly", async () => {
    const user = userEvent.setup();
    renderFilter();

    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
