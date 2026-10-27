import {
  clamp,
  decimalsOf,
  defaultParse,
  isPartialNumber,
  roundTo,
} from "../number-format";

describe("number format helpers", () => {
  it("counts the decimals of a number", () => {
    expect(decimalsOf(3)).toBe(0);
    expect(decimalsOf(1.25)).toBe(2);
  });

  it("counts the decimals of a number written with an exponent", () => {
    expect(decimalsOf(1e-7)).toBe(7);
    expect(decimalsOf(1.5e-7)).toBe(8);
    expect(decimalsOf(1e21)).toBe(0);
  });

  it("has no decimals when the number is not finite", () => {
    expect(decimalsOf(Number.NaN)).toBe(0);
    expect(decimalsOf(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it("rounds to a precision kept between 0 and 100", () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(1.5, -3)).toBe(2);
  });

  it("clamps a value between a min and a max", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it("parses a number with a comma and rejects what is not one", () => {
    expect(defaultParse(" 1,5 ")).toBe(1.5);
    expect(defaultParse("")).toBeNull();
    expect(defaultParse("-")).toBeNull();
    expect(defaultParse("abc")).toBeNull();
  });

  it("accepts a partial number while typing", () => {
    expect(isPartialNumber("-", undefined)).toBe(true);
    expect(isPartialNumber("1,", undefined)).toBe(true);
    expect(isPartialNumber("1.", 0)).toBe(false);
    expect(isPartialNumber("12", 0)).toBe(true);
  });
});
