export type NewState<T> = ((oldState: T) => T) | T;

export type Setter<T> = (newState: NewState<T>) => void;

export const resolveNewState =
  <T>(newState: NewState<T>) =>
  (oldState: T): T => {
    if (typeof newState === "function") {
      return (newState as (oldState: T) => T)(oldState);
    }

    return newState as T;
  };
