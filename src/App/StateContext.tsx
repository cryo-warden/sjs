import { PartyState, SelectionCriteria } from "@/logic/Selection";
import {
  createContext,
  ReactNode,
  useContext,
  useState as useStateReact,
} from "react";

export type State = {
  criteria: SelectionCriteria;
  party: PartyState;
};

const StateContext = createContext<{
  state: State;
  setState: (newState: (oldState: State) => State) => void;
}>(null as any);

export const WithState = ({
  initialize,
  children,
}: {
  initialize: () => State;
  children: ReactNode;
}) => {
  const [state, setState] = useStateReact(initialize);
  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

export const useCriteria = () => useContext(StateContext).state.criteria;
export const useSetCriteria = () => {
  const setState = useContext(StateContext).setState;
  return (criteria: SelectionCriteria) =>
    setState((oldState) => ({
      ...oldState,
      criteria,
    }));
};

export const useParty = () => useContext(StateContext).state.party;
export const useSetParty = () => {
  const setState = useContext(StateContext).setState;
  return (party: PartyState) =>
    setState((oldState) => ({ ...oldState, party }));
};
