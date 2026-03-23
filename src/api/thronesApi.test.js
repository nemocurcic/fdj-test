import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchCharacters } from "./thronesApi";

describe("fetchCharacters", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches from the correct URL", async () => {
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchCharacters();

    expect(spy).toHaveBeenCalledWith(
      "https://thronesapi.com/api/v2/Characters",
    );
  });

  it("returns parsed JSON on success", async () => {
    const mockData = [{ id: 1, fullName: "Jon Snow" }];
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchCharacters();

    expect(result).toEqual(mockData);
  });

  it("throws on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchCharacters()).rejects.toThrow(
      "Failed to fetch characters",
    );
  });
});
