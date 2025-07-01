import { useState, useCallback } from "react";
import { NewState, resolveNewState, Setter } from "./NewState";

const store = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const load = <T>(key: string): T | null => {
  const stateJson = localStorage.getItem(key);
  if (stateJson == null) {
    return null;
  }
  return JSON.parse(stateJson) as T;
};

const loadOrInit =
  <T>(
    key: string,
    initialize: () => T,
    migrate: (value: any) => T = (x) => x
  ) =>
  (): T =>
    migrate(load(key)) ?? initialize();

export const useLocalStorageState = <T>(
  key: string,
  init: () => T,
  migrate?: (value: any) => T
) => {
  const [value, setValue] = useState(loadOrInit(key, init, migrate));
  const setAndStoreValue: Setter<T> = useCallback(
    (newValue: NewState<T>) => {
      setValue((value) => {
        const resultValue = resolveNewState(newValue)(value);
        store(key, resultValue);
        return resultValue;
      });
    },
    [setValue]
  );
  return [value, setAndStoreValue] as const;
};
