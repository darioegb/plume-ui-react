import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "../use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with the given value", () => {
    const { result } = renderHook(() =>
      useDebounce({ value: "a", delay: 200 }),
    );
    expect(result.current).toBe("a");
  });

  it("updates the value once the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce({ value, delay: 200 }),
      { initialProps: { value: "a" } },
    );
    rerender({ value: "b" });
    expect(result.current).toBe("a");
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("b");
  });

  it("restarts the delay on every change", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce({ value, delay: 200 }),
      { initialProps: { value: "a" } },
    );
    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("a");
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe("c");
  });

  it("does not update after unmounting", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce({ value, delay: 200 }),
      { initialProps: { value: "a" } },
    );
    rerender({ value: "b" });
    unmount();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("a");
  });
});
