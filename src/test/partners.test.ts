import { describe, it, expect } from "vitest";
import { partnerNames, partnerList } from "@/data/partners";

describe("partner data", () => {
  it("should export at least one partner name", () => {
    expect(partnerNames.length).toBeGreaterThan(0);
  });

  it("should include configured partner details", () => {
    expect(partnerList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Jubilee" }),
        expect.objectContaining({ name: "GA" }),
      ])
    );
  });

  it("partners should have valid logo paths", () => {
    partnerList.forEach((p) => {
      expect(p.logo).toBeTruthy();
      // logos are imported assets so we just check it's a string
      expect(typeof p.logo).toBe("string");
    });
  });
});