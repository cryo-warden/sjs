import { JobName } from "./Job";
import { LOCATION_NAMES } from "./Location";
import { ConvertTuple } from "../type";

export type JobLocationSelectionCriteria = {
  weightMatrix: number[][];
};

export type LocationJobNames = ConvertTuple<typeof LOCATION_NAMES, JobName[]>;

export const INHERENT_LOCATION_JOB_NAMES: LocationJobNames = [
  ["KNIGHT", "BLACK_MAGE", "WHITE_MAGE", "BLUE_MAGE", "MONK", "THIEF"],
  ["RED_MAGE", "TIME_MAGE", "SUMMONER", "BERSERKER", "MYSTIC_KNIGHT"],
  ["BEASTMASTER", "GEOMANCER", "NINJA"],
  ["RANGER", "BARD"],
  ["DRAGOON", "DANCER", "CHEMIST", "SAMURAI"],
  ["MIME"],
];

export const SNOWBALL_JOB_LOCATION_NAMES = INHERENT_LOCATION_JOB_NAMES.map(
  (_, i) => {
    const result: JobName[] = [];
    for (let j = 0; j <= i; ++j) {
      result.push(...INHERENT_LOCATION_JOB_NAMES[j]);
    }
    return result;
  }
) as LocationJobNames;
