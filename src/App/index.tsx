import "./index.css";
import { WithLanguageContext } from "./LanguageContext";
import { initializeSelectionState, State, WithState } from "./StateContext";
import { Header } from "./Header";
import { About } from "./About";
import { JobLocationButtons } from "./JobLocationButtons";
import { SelectionPicker } from "./SelectionPicker";

const initializeState = (): State => ({
  selectionStateIndex: 0,
  selectionStates: [initializeSelectionState()],
});

export function App() {
  return (
    <WithLanguageContext>
      <WithState initialize={initializeState}>
        <div className="App">
          <Header />
          <JobLocationButtons />
          <SelectionPicker />
          <About />
        </div>
      </WithState>
    </WithLanguageContext>
  );
}

export default App;
