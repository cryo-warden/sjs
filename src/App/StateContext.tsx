import {
  applyBanList,
  createNewPartyState,
  defaultBanList,
  defaultCriteria,
  PartyState,
  SelectionCriteria,
} from "@/logic/Selection";
import { createContext, ReactNode, useContext } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { NewState, resolveNewState, Setter } from "./NewState";

export type SelectionState = {
  criteria: SelectionCriteria;
  party: PartyState;
};

const currentVersion = 0 as const;
type CurrentVersion = typeof currentVersion;

export type State = {
  version: CurrentVersion;
  selectionStateIndex: number;
  selectionStates: SelectionState[];
};

const migrations: ((state: any) => any)[] = [];

const migrateState = (state: any): State => {
  let newState = state;
  for (let i = state?.version ?? 0; i < migrations.length; ++i) {
    newState = migrations[i](newState);
  }
  return newState;
};

const stateKey = "v0.0.0/state";

const StateContext = createContext<{
  state: State;
  setState: Setter<State>;
}>(null as any);

export const WithState = ({
  initialize,
  children,
}: {
  initialize: () => State;
  children: ReactNode;
}) => {
  const [state, setState] = useLocalStorageState(
    stateKey,
    initialize,
    migrateState
  );
  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

export const useSelectionState = () => {
  const { state } = useContext(StateContext);
  return state.selectionStates[state.selectionStateIndex];
};
export const useSetSelectionState = (): Setter<SelectionState> => {
  const { setState } = useContext(StateContext);
  return (newSelectionState: NewState<SelectionState>) =>
    setState((oldState) => {
      const { selectionStates, selectionStateIndex } = oldState;
      return {
        ...oldState,
        selectionStates: selectionStates.map((current, i) =>
          i === selectionStateIndex
            ? resolveNewState(newSelectionState)(current)
            : current
        ),
      };
    });
};

export const useCriteria = () => useSelectionState().criteria;
export const useSetCriteria = (): Setter<SelectionCriteria> => {
  const setState = useSetSelectionState();
  return (newCriteria: NewState<SelectionCriteria>) =>
    setState((oldState) => ({
      ...oldState,
      criteria: resolveNewState(newCriteria)(oldState.criteria),
    }));
};

export const useParty = () => useSelectionState().party;
export const useSetParty = (): Setter<PartyState> => {
  const setState = useSetSelectionState();
  return (newParty: NewState<PartyState>) =>
    setState((oldState) => ({
      ...oldState,
      party: resolveNewState(newParty)(oldState.party),
    }));
};

export const useSelectionIndex = () =>
  useContext(StateContext).state.selectionStateIndex;
export const useSetSelectionIndex = (): Setter<number> => {
  const { setState } = useContext(StateContext);
  return (newIndex: NewState<number>) =>
    setState((oldState) => ({
      ...oldState,
      selectionStateIndex: resolveNewState(newIndex)(
        oldState.selectionStateIndex
      ),
    }));
};
export const useSetPreviousSelectionIndex = () => {
  const { setState } = useContext(StateContext);
  return () =>
    setState((oldState) => ({
      ...oldState,
      selectionStateIndex: Math.max(0, oldState.selectionStateIndex - 1),
    }));
};
export const useSetNextSelectionIndex = () => {
  const { setState } = useContext(StateContext);
  return () =>
    setState((oldState) => ({
      ...oldState,
      selectionStateIndex: Math.min(
        oldState.selectionStateIndex + 1,
        oldState.selectionStates.length - 1
      ),
    }));
};
export const useDeleteSelection = () => {
  const { setState } = useContext(StateContext);
  return () => {
    setState((oldState) => {
      if (oldState.selectionStates.length <= 1) {
        return oldState;
      }
      const selectionStates = oldState.selectionStates.filter(
        (_, i) => i !== oldState.selectionStateIndex
      );
      return {
        ...oldState,
        selectionStateIndex: Math.min(
          Math.max(0, oldState.selectionStateIndex - 1),
          selectionStates.length - 1
        ),
        selectionStates,
      };
    });
  };
};
export const useAppendNewSelection = (
  initializeSelectionState: () => SelectionState
) => {
  const { setState } = useContext(StateContext);
  return () => {
    setState((oldState) => {
      return {
        ...oldState,
        selectionStateIndex: oldState.selectionStates.length,
        selectionStates: [
          ...oldState.selectionStates,
          initializeSelectionState(),
        ],
      };
    });
  };
};

export const useSelectionsLength = () =>
  useContext(StateContext).state.selectionStates.length;

// TODO Make criteria configurable with new UI.
const criteria = applyBanList(defaultBanList, defaultCriteria);

export const initializeSelectionState = () => ({
  criteria,
  party: createNewPartyState(),
});
