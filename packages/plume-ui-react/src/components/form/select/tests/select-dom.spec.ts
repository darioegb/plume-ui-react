import {
  getEnabledOptions,
  scrollOptionIntoView,
  stepOption,
} from "../select-dom";

const option = (id: string, attributes = ""): string =>
  `<div role="option" id="${id}" ${attributes}></div>`;

const make = (count: number): HTMLElement[] =>
  Array.from({ length: count }, (_, index) => {
    const element = document.createElement("div");
    element.id = `o${index}`;
    return element;
  });

describe("select dom helpers", () => {
  it("lists the enabled and visible options", () => {
    const listbox = document.createElement("div");
    listbox.innerHTML =
      option("a") +
      option("b", 'aria-disabled="true"') +
      option("c", "hidden") +
      option("d");
    expect(getEnabledOptions(listbox).map((element) => element.id)).toEqual([
      "a",
      "d",
    ]);
  });

  it("has no options without a listbox", () => {
    expect(getEnabledOptions(null)).toEqual([]);
  });

  describe("stepOption", () => {
    const options = make(4);

    it("finds nothing in an empty list", () => {
      expect(stepOption([], undefined, 1)).toBeUndefined();
    });

    it("starts at the first option going down and at the last going up", () => {
      expect(stepOption(options, undefined, 1)).toBe(options[0]);
      expect(stepOption(options, undefined, -1)).toBe(options[3]);
    });

    it("moves one option at a time", () => {
      expect(stepOption(options, "o1", 1)).toBe(options[2]);
      expect(stepOption(options, "o1", -1)).toBe(options[0]);
    });

    it("wraps around at the ends when it moves one option", () => {
      expect(stepOption(options, "o0", -1)).toBe(options[3]);
      expect(stepOption(options, "o3", 1)).toBe(options[0]);
    });

    it("stops at the ends when it moves a page", () => {
      expect(stepOption(options, "o1", -10)).toBe(options[0]);
      expect(stepOption(options, "o2", 10)).toBe(options[3]);
    });
  });

  it("scrolls an option into view when the browser can", () => {
    const element = document.createElement("div");
    element.scrollIntoView = vi.fn();
    scrollOptionIntoView(element);
    expect(element.scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
    expect(() => scrollOptionIntoView(undefined)).not.toThrow();
    expect(() =>
      scrollOptionIntoView(document.createElement("div")),
    ).not.toThrow();
  });
});
