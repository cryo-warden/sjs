import { LocationId } from "@/logic/Location";
import { JobButton } from "./JobButton";
import { JobList } from "./JobList";
import { useLanguage } from "./LanguageContext";
import { useParty } from "./StateContext";
import "./JobLocationButtons.css";

export const JobLocationButton = ({ location }: { location: LocationId }) => {
  const party = useParty();
  const ownJobs = party.locationJobs[location];
  const language = useLanguage();
  const locationName = language.locationNames[location];
  return (
    <div className="JobLocationButton">
      <JobButton location={location}>{locationName}</JobButton>
      {ownJobs.length <= 0 ? null : <JobList jobs={ownJobs} />}
    </div>
  );
};
