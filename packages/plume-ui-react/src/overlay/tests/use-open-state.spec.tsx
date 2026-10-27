import { act, renderHook } from "@testing-library/react";
import { useOpenState } from "../use-open-state";

describe("useOpenState", () => {
  it("opens and closes by itself when it is not controlled", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useOpenState({ onOpenChange }));
    expect(result.current[0]).toBe(false);
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("stays where the parent puts it when it is controlled", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useOpenState({ onOpenChange, open: false }),
    );
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(false);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("does not report a change to the state it already has", () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useOpenState({ defaultOpen: true, onOpenChange }),
    );
    act(() => result.current[1](true));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
