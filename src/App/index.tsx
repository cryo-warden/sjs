import {
  applyBanList,
  createNewPartyState,
  defaultBanList,
  defaultCriteria,
} from "../logic/Selection";
import "./index.css";
import { WithLanguageContext } from "./LanguageContext";
import { WithState } from "./StateContext";
import { Header } from "./Header";
import { About } from "./About";
import { JobLocationButtons } from "./JobLocationButtons";

// TODO Make criteria configurable with new UI.
const criteria = applyBanList(defaultBanList, defaultCriteria);
const initializeState = () => ({
  criteria,
  party: createNewPartyState(),
});

export function App() {
  return (
    <WithLanguageContext>
      <WithState initialize={initializeState}>
        <div className="App">
          <Header />
          <JobLocationButtons />
          <About />
        </div>
      </WithState>
    </WithLanguageContext>
  );
}

export default App;
