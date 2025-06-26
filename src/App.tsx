import { useState } from "react";
import { JobName, sandbox } from "./Job";
import {
  applyBanList,
  createNewPartyState,
  defaultBanList,
  defaultCriteria,
  select,
} from "./Selection";
import "./App.css";

// TODO Make criteria configurable with new UI.
const criteria = applyBanList(defaultBanList, defaultCriteria);

// TODO Show the current party.
// TODO Show the estimated average power level of the current party.

// TODO Split job button across different locations.
export function App() {
  const [newestJobs, setNewestJobs] = useState<JobName[]>([]);
  const [partyState, setPartyState] = useState(createNewPartyState);
  return (
    <div className="App">
      {newestJobs.map((job, i) => (
        <div key={i}>{job}</div>
      ))}
      <button onClick={sandbox}>Sandbox</button>
      <button>Nothing</button>
      <button
        onClick={() => {
          const { newJobNames: newJobs, nextPartyState } = select(
            criteria,
            partyState
          );
          setNewestJobs(newJobs);
          setPartyState(nextPartyState);
          console.log(newJobs, nextPartyState);
        }}
      >
        Next Job
      </button>
    </div>
  );
}

export default App;
