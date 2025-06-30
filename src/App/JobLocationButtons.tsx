import { LOCATION_NAMES, LocationId } from "@/logic/Location";
import { JobLocationButton } from "./JobLocationButton";

export const JobLocationButtons = () => (
  <div className="panel panel-dynamic JobLocationButtons">
    {LOCATION_NAMES.map((_, i) => (
      <JobLocationButton key={i} location={i as LocationId} />
    ))}
  </div>
);
