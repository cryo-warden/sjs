import { JobName } from "./Job";
import { LOCATION_NAMES } from "./Location";
import { ConvertTuple } from "./type";

export type JobLocationSelectionCriteria = {
  weightMatrix: number[][];
};

export const INHERENT_JOB_LOCATION_NAMES: ConvertTuple<
  typeof LOCATION_NAMES,
  JobName[]
> = [
  ["KNIGHT", "BLACK_MAGE", "WHITE_MAGE", "BLUE_MAGE", "MONK", "THIEF"],
  ["RED_MAGE", "TIME_MAGE", "SUMMONER", "BERSERKER", "MYSTIC_KNIGHT"],
  ["BEASTMASTER", "GEOMANCER", "NINJA"],
  ["RANGER", "BARD"],
  ["DRAGOON", "DANCER", "CHEMIST", "SAMURAI"],
  ["MIME"],
];
