import { JOB_NAMES, JobName, JobSelectionCriteria } from "./Job";
import {
  INHERENT_JOB_LOCATION_NAMES as INHERENT_LOCATION_JOB_NAMES,
  JobLocationSelectionCriteria,
} from "./JobLocation";
import {
  LOCATION_INDEXES,
  LOCATION_NAMES,
  LocationName,
  LocationSelectionCriteria,
  nextLocationName,
} from "./Location";
import { createMatrix, createVector } from "./math";

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
        return INHERENT_LOCATION_JOB_NAMES[j].includes(JOB_NAMES[i]) ? 1 : 0;
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
  locationName: LocationName | null;
  jobNames: JobName[];
};

export const createNewPartyState = (): PartyState => ({
  jobNames: [],
  locationName: LOCATION_NAMES[0],
});

export type Selection = {
  nextPartyState: PartyState;
  newJobNames: JobName[];
};

const selectSingleJob = (
  locationName: LocationName,
  job: JobSelectionCriteria,
  jobLocation: JobLocationSelectionCriteria,
  currentJobs: JobName[]
): JobName | null => {
  let totalWeight = 0;
  const locationIndex = LOCATION_INDEXES[locationName];
  const weightedJobOptions = job
    .map((jobCriterion, i) => {
      const jobName = JOB_NAMES[i];
      const jobCount = currentJobs.filter((job) => job === jobName).length;
      const weight = jobLocation.weightMatrix[i][locationIndex];
      if (weight <= 0 || jobCount >= jobCriterion.allowedCount) {
        return null;
      }

      totalWeight += weight;
      return [weight, jobName] as const;
    })
    .filter((pair) => pair != null);

  // TODO Factor out weightedSample function.
  const weightPoint = totalWeight * Math.random();
  for (let cummulativeWeight = 0, i = 0; i < weightedJobOptions.length; ++i) {
    const [weight, jobName] = weightedJobOptions[i];
    cummulativeWeight += weight;

    if (cummulativeWeight > weightPoint) {
      return jobName;
    }
  }

  return null;
};

export const select = (
  criteria: SelectionCriteria,
  party: PartyState
): Selection => {
  if (party.locationName == null) {
    return {
      nextPartyState: party,
      newJobNames: [],
    };
  }

  const { job, jobLocation, location } = criteria;
  const locationIndex = LOCATION_INDEXES[party.locationName];
  const { jobSelectionCount } = location[locationIndex];

  const newJobNames: JobName[] = [];
  for (let i = 0; i < jobSelectionCount; ++i) {
    const newJobName = selectSingleJob(party.locationName, job, jobLocation, [
      ...party.jobNames,
      ...newJobNames,
    ]);
    if (newJobName == null) {
      break;
    }
    newJobNames.push(newJobName);
  }

  return {
    nextPartyState: {
      jobNames: [...party.jobNames, ...newJobNames],
      locationName: nextLocationName(party.locationName),
    },
    newJobNames,
  };
};
