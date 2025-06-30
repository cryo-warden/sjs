import { JOB_NAMES, JobId, JobName, JobSelectionCriteria } from "./Job";
import {
  INHERENT_LOCATION_JOB_NAMES,
  JobLocationSelectionCriteria,
  SNOWBALL_JOB_LOCATION_NAMES,
} from "./JobLocation";
import {
  LocationId,
  LOCATION_NAMES,
  LocationSelectionCriteria,
  nextLocation,
} from "./Location";
import { createMatrix, weightedSample } from "../math";
import { ConvertTuple } from "@/type";

export type SelectionCriteria = {
  job: JobSelectionCriteria;
  location: LocationSelectionCriteria;
  jobLocation: JobLocationSelectionCriteria;
};

export const inherentCriteria: SelectionCriteria = {
  job: JOB_NAMES.map(() => ({
    allowedCount: 1,
  })) as JobSelectionCriteria,
  location: LOCATION_NAMES.map(() => ({
    jobSelectionCount: 1,
  })) as LocationSelectionCriteria,
  jobLocation: {
    weightMatrix: createMatrix(
      JOB_NAMES.length,
      LOCATION_NAMES.length,
      (i, j) => (INHERENT_LOCATION_JOB_NAMES[j].includes(JOB_NAMES[i]) ? 1 : 0)
    ),
  },
};

export const defaultCriteria: SelectionCriteria = {
  job: JOB_NAMES.map(() => ({
    allowedCount: 1,
  })) as JobSelectionCriteria,
  location: LOCATION_NAMES.map(() => ({
    jobSelectionCount: 1,
  })) as LocationSelectionCriteria,
  jobLocation: {
    weightMatrix: createMatrix(
      JOB_NAMES.length,
      LOCATION_NAMES.length,
      (i, j) => {
        const locationName = LOCATION_NAMES[j];
        if (locationName == "SUNKEN") {
          // Allow all jobs at SUNKEN by default.
          return 1;
        }
        return SNOWBALL_JOB_LOCATION_NAMES[j].includes(JOB_NAMES[i]) ? 1 : 0;
      }
    ),
  },
};

export const defaultBanList = [
  "FREELANCER",
  "MIME",
  "ORACLE",
  "GLADIATOR",
  "CANNONEER",
  "NECROMANCER",
] as const satisfies JobName[];

// TODO Functions to limit the maximum power, minimum power, or set the weight to favor certain features.

export const applyBanList = (
  bannedJobNames: JobName[],
  criteria: SelectionCriteria
): SelectionCriteria => {
  const { job, jobLocation, location } = criteria;
  const newJobCriteria = job.map((job, i) =>
    bannedJobNames.includes(JOB_NAMES[i]) ? { allowedCount: 0 } : job
  ) as JobSelectionCriteria;
  return {
    job: newJobCriteria,
    jobLocation,
    location,
  };
};

export type PartyState = {
  location: LocationId | null;
  jobs: JobId[];
  locationJobs: ConvertTuple<typeof LOCATION_NAMES, JobId[]>;
};

export const createNewPartyState = (): PartyState => ({
  jobs: [],
  location: 0,
  locationJobs: [[], [], [], [], [], []],
});

export type Selection = {
  nextPartyState: PartyState;
};

const selectSingleJob = (
  location: LocationId,
  jobCriteria: JobSelectionCriteria,
  jobLocationCriteria: JobLocationSelectionCriteria,
  currentJobs: JobId[]
): JobId | null => {
  const weightedJobOptions = jobCriteria
    .map((jobCriterion, i) => {
      const jobCount = currentJobs.filter((job) => job === i).length;
      const weight = jobLocationCriteria.weightMatrix[i][location];
      if (weight <= 0 || jobCount >= jobCriterion.allowedCount) {
        return null;
      }

      return [weight, i as JobId] as const;
    })
    .filter((pair) => pair != null);

  return weightedSample(weightedJobOptions);
};

export const select = (
  criteria: SelectionCriteria,
  party: PartyState
): Selection => {
  if (party.location == null) {
    return {
      nextPartyState: party,
    };
  }

  const { job, jobLocation, location } = criteria;
  const { jobSelectionCount } = location[party.location];
  const locationJobs = party.locationJobs.slice() as typeof party.locationJobs;

  const newJobs: JobId[] = [];
  for (let i = 0; i < jobSelectionCount; ++i) {
    const newJob = selectSingleJob(party.location, job, jobLocation, [
      ...party.jobs,
      ...newJobs,
    ]);
    if (newJob == null) {
      break;
    }
    newJobs.push(newJob);
  }

  locationJobs[party.location] = newJobs;

  return {
    nextPartyState: {
      jobs: [...party.jobs, ...newJobs],
      location: nextLocation(party.location),
      locationJobs,
    },
  };
};
