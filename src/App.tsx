import { ReactNode, useState } from "react";
import { JobName } from "./Job";
import {
  applyBanList,
  createNewPartyState,
  defaultBanList,
  defaultCriteria,
  PartyState,
  select,
} from "./Selection";
import "./App.css";
import { LOCATION_NAMES, LocationName } from "./Location";

// TODO Make criteria configurable with new UI.
const criteria = applyBanList(defaultBanList, defaultCriteria);

// TODO Show the estimated average power level of the current party.

const JobList = ({ jobs }: { jobs: JobName[] }) => {
  return (
    <>
      {jobs.map((job, i) => (
        <div key={i}>{job}</div>
      ))}
    </>
  );
};

const JobButton = ({
  children,
  locationName,
  partyState,
  setPartyState,
  setNewestJobs,
}: {
  children: ReactNode;
  locationName: LocationName;
  partyState: PartyState;
  setPartyState: (partyState: PartyState) => void;
  setNewestJobs: (newestJobs: JobName[]) => void;
}) => {
  return (
    <button
      className="JobButton"
      disabled={locationName != partyState.locationName}
      onClick={() => {
        const { newJobNames: newJobs, nextPartyState } = select(
          criteria,
          partyState
        );
        setNewestJobs(newJobs);
        setPartyState(nextPartyState);
      }}
    >
      {children}
    </button>
  );
};

const JobLocationButton = ({
  locationName,
  partyState,
  setPartyState,
}: {
  locationName: LocationName;
  partyState: PartyState;
  setPartyState: (partyState: PartyState) => void;
}) => {
  // TODO Store locations of jobs in PartyState.
  const [ownJobs, setOwnJobs] = useState<JobName[]>([]);
  return (
    <div className="JobLocationButton">
      <JobButton
        locationName={locationName}
        partyState={partyState}
        setPartyState={setPartyState}
        setNewestJobs={setOwnJobs}
      >
        {locationName}
      </JobButton>
      {ownJobs.length <= 0 ? null : <JobList jobs={ownJobs} />}
    </div>
  );
};

export function App() {
  const [partyState, setPartyState] = useState(createNewPartyState);
  return (
    <div className="App">
      <header>
        <h1 className="mood-chill left-align">Six Job Siesta</h1>
        <h2 className="mood-respect right-align">Final Fantasy V</h2>
      </header>
      <div className="panel panel-dynamic JobLocationButtons">
        {LOCATION_NAMES.map((locationName) => (
          <>
            <JobLocationButton
              locationName={locationName}
              partyState={partyState}
              setPartyState={setPartyState}
            />
          </>
        ))}
      </div>
      <div className="panel">
        <p>
          A chill way to play. You can unlock a new job each time you collect a
          set of jobs. More combinations, more overpowered!
        </p>
        <p>Upcoming Features:</p>
        <ul>
          <li>Pre-Baked Ruleset Options</li>
          <li>Full-Custom Mode</li>
          <li>Translations if requested.</li>
        </ul>
        <p>
          Choose the number of jobs gained at each location, how likely each job
          is, and even how skilled your party can be at support or damage.
        </p>
      </div>
    </div>
  );
}

export default App;
