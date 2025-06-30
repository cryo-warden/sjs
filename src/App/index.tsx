import { ReactNode, useState } from "react";
import { JobId, JobName } from "../logic/Job";
import {
  applyBanList,
  createNewPartyState,
  defaultBanList,
  defaultCriteria,
  PartyState,
  select,
} from "../logic/Selection";
import "./index.css";
import { LOCATION_NAMES, LocationId, LocationName } from "../logic/Location";
import { useLanguage, WithLanguageContext } from "./LanguageContext";
import { language } from "@/language/en";

// TODO Make criteria configurable with new UI.
const criteria = applyBanList(defaultBanList, defaultCriteria);

// TODO Show the estimated average power level of the current party.

const JobList = ({ jobs }: { jobs: JobId[] }) => {
  const langauge = useLanguage();
  return (
    <>
      {jobs.map((job, i) => (
        <div key={i}>{language.jobNames[job]}</div>
      ))}
    </>
  );
};

const JobButton = ({
  children,
  location,
  partyState,
  setPartyState,
}: {
  children: ReactNode;
  location: LocationId;
  partyState: PartyState;
  setPartyState: (partyState: PartyState) => void;
}) => {
  return (
    <button
      className="JobButton"
      disabled={location != partyState.location}
      onClick={() => {
        const { nextPartyState } = select(criteria, partyState);
        setPartyState(nextPartyState);
      }}
    >
      {children}
    </button>
  );
};

const JobLocationButton = ({
  location,
  partyState,
  setPartyState,
}: {
  location: LocationId;
  partyState: PartyState;
  setPartyState: (partyState: PartyState) => void;
}) => {
  const ownJobs = partyState.locationJobs[location];
  const language = useLanguage();
  const locationName = language.locationNames[location];
  return (
    <div className="JobLocationButton">
      <JobButton
        location={location}
        partyState={partyState}
        setPartyState={setPartyState}
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
    <WithLanguageContext>
      <div className="App">
        <header>
          <h1 className="mood-chill left-align">Six Job Siesta</h1>
          <h2 className="mood-respect right-align">Final Fantasy V</h2>
        </header>
        <div className="panel panel-dynamic JobLocationButtons">
          {LOCATION_NAMES.map((_, i) => (
            <>
              <JobLocationButton
                location={i as LocationId}
                partyState={partyState}
                setPartyState={setPartyState}
              />
            </>
          ))}
        </div>
        <div className="panel">
          {/* TODO Add markdown rendering to move all text into language libraries. */}
          <p>
            A chill way to play. You can unlock a new job each time you collect
            a set of jobs. More combinations, more overpowered!
          </p>
          <p>Upcoming Features:</p>
          <ul>
            <li>Pre-Baked Ruleset Options</li>
            <li>Full-Custom Mode</li>
            <li>Translations if requested.</li>
          </ul>
          <p>
            Choose the number of jobs gained at each location, how likely each
            job is, and even how skilled your party can be at support or damage.
          </p>
        </div>
      </div>
    </WithLanguageContext>
  );
}

export default App;
