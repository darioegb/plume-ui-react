import { act, renderHook } from "@testing-library/react";
import { useSelectGroupContext } from "../select-group-context";
import { useSelectRegistry } from "../use-select-registry";

describe("select internals", () => {
  it("asks for a SelectGroup around the parts of a group", () => {
    const error = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    expect(() =>
      renderHook(() => useSelectGroupContext("SelectGroupLabel")),
    ).toThrow("SelectGroupLabel must be used within a <SelectGroup>");
    error.mockRestore();
  });

  it("keeps the newest record of a value when an older one unregisters", () => {
    const { result } = renderHook(() => useSelectRegistry());
    const record = (label: string) => ({ disabled: false, label, value: "a" });
    let first = () => undefined as void;
    let second = () => undefined as void;
    act(() => {
      first = result.current.register(record("Old"));
      second = result.current.register(record("New"));
    });
    act(() => first());
    expect(result.current.options.map((option) => option.label)).toEqual([
      "New",
    ]);
    act(() => second());
    expect(result.current.options).toEqual([]);
  });
});
