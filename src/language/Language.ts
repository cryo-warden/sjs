import { JOB_NAMES } from "@/logic/Job";
import { LOCATION_NAMES } from "@/logic/Location";
import { ConvertTuple } from "@/type";

export type Language = {
  jobNames: ConvertTuple<typeof JOB_NAMES, string>;
  locationNames: ConvertTuple<typeof LOCATION_NAMES, string>;
  blobRecord: {
    title: string;
    ff5: string;
    about: string;
  };
};
