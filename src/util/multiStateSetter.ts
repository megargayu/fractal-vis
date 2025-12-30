import { useCallback, type Dispatch, type SetStateAction } from "react";

// Necessary to prevent typescript bug leading to error
// https://github.com/microsoft/TypeScript/issues/37663#issuecomment-2130687770
const isFunction = (x: unknown) => typeof x === "function";

const useMultiStateSetter = <T extends object, K extends keyof T>(
  setState: Dispatch<SetStateAction<T>>,
  key: K
): Dispatch<SetStateAction<T[K]>> => {
  return useCallback(
    (value) => {
      setState((prev) => ({
        ...prev,
        [key]: isFunction(value) ? value(prev[key]) : value,
      }));
    },
    [setState, key]
  );
};

export const useSetMultiState = <T extends object, K extends keyof T>(
  setState: Dispatch<SetStateAction<T>>,
  key: K,
  value: T[K] | ((prev: T[K]) => T[K])
) => {
  useMultiStateSetter(setState, key)(value);
};

export default useMultiStateSetter;
