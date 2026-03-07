import { act, renderHook } from "@testing-library/react";
import { useOpeningBootstrap } from "./useOpeningBootstrap";

describe("useOpeningBootstrap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("keeps opening visible until minimum duration and data readiness", () => {
    const { result, rerender } = renderHook(
      ({ authLoading, hasUser, loadingData }) =>
        useOpeningBootstrap({
          authLoading,
          hasUser,
          loadingData,
          minDurationMs: 4000,
          slowThresholdMs: 4100,
        }),
      {
        initialProps: {
          authLoading: true,
          hasUser: true,
          loadingData: true,
        },
      },
    );

    expect(result.current.showOpening).toBe(true);
    expect(result.current.canExit).toBe(false);

    rerender({ authLoading: false, hasUser: true, loadingData: false });
    expect(result.current.isDataReady).toBe(true);
    expect(result.current.canExit).toBe(false);

    act(() => {
      vi.advanceTimersByTime(3999);
    });
    expect(result.current.canExit).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.canExit).toBe(true);

    act(() => {
      result.current.markExited();
    });
    expect(result.current.showOpening).toBe(false);
  });

  it("exposes slow state after threshold", () => {
    const { result } = renderHook(() =>
      useOpeningBootstrap({
        authLoading: false,
        hasUser: false,
        loadingData: false,
        minDurationMs: 4000,
        slowThresholdMs: 4100,
      }),
    );

    expect(result.current.showSlowState).toBe(false);

    act(() => {
      vi.advanceTimersByTime(4100);
    });

    expect(result.current.showSlowState).toBe(true);
  });
});
