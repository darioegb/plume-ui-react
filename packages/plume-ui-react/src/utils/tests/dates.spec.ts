import {
  formatDate,
  getDateFromDateString,
  getDateStringByLanguage,
  validateFormatDate,
} from "../dates";

const start = new Date(2024, 0, 5);
const end = new Date(2024, 0, 20);

describe("getDateStringByLanguage", () => {
  it("is empty without a date", () => {
    expect(getDateStringByLanguage({ language: "en" })).toBe("");
    expect(getDateStringByLanguage({ displayFormat: "dd/mm/yyyy" })).toBe("");
  });

  it("writes a date with a display format", () => {
    expect(
      getDateStringByLanguage({
        displayFormat: "dd/mm/yyyy",
        startDate: start,
      }),
    ).toBe("05/01/2024");
  });

  it("writes a range with a display format", () => {
    expect(
      getDateStringByLanguage({
        displayFormat: "yyyy-mm-dd",
        endDate: end,
        range: true,
        startDate: start,
      }),
    ).toBe("2024-01-05 - 2024-01-20");
  });

  it("writes a range for a language", () => {
    expect(
      getDateStringByLanguage({
        endDate: end,
        language: "en-US",
        range: true,
        startDate: start,
      }),
    ).toBe("01/05/2024 - 01/20/2024");
  });

  it("writes only the start of a range that has no end yet", () => {
    expect(
      getDateStringByLanguage({
        language: "en-US",
        range: true,
        startDate: start,
      }),
    ).toBe("01/05/2024");
  });

  it("expands a two letter language and falls back to the browser language", () => {
    expect(getDateStringByLanguage({ language: "de", startDate: start })).toBe(
      "05.01.2024",
    );
    expect(getDateStringByLanguage({ startDate: start })).toMatch(/2024/);
  });
});

describe("formatDate", () => {
  it("fills the tokens in any case", () => {
    expect(formatDate(start, "DD.MM.YYYY")).toBe("05.01.2024");
  });
});

describe("validateFormatDate", () => {
  it("accepts a real date written as the format asks", () => {
    expect(validateFormatDate("05/01/2024", "en", "dd/mm/yyyy")).toBe(true);
  });

  it("rejects a text that does not match the format", () => {
    expect(validateFormatDate("5/1/2024", "en", "dd/mm/yyyy")).toBe(false);
    expect(validateFormatDate("hello", "en", "dd/mm/yyyy")).toBe(false);
  });

  it("rejects a date that does not exist", () => {
    expect(validateFormatDate("31/02/2024", "en", "dd/mm/yyyy")).toBe(false);
  });

  it("uses the format of the language when none is given", () => {
    expect(validateFormatDate("01/05/2024", "en-US")).toBe(true);
  });
});

describe("getDateFromDateString", () => {
  it("reads the parts by their position in the format", () => {
    expect(getDateFromDateString("05/01/2024", "dd/mm/yyyy")).toEqual(start);
    expect(getDateFromDateString("01/05/2024")).toEqual(start);
  });

  it("is an invalid date when a part is missing from the format", () => {
    expect(getDateFromDateString("2024", "yyyy").getTime()).toBeNaN();
  });
});
