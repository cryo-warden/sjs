import { ConvertTuple, KeyOfTuple } from "../type";

export const LOCATION_NAMES = [
  "WIND",
  "WATER",
  "FIRE",
  "CRESCENT",
  "EARTH",
  "SUNKEN",
] as const;

export const LOCATION_INDEXES = {
  WIND: 0,
  WATER: 1,
  FIRE: 2,
  CRESCENT: 3,
  EARTH: 4,
  SUNKEN: 5,
};

export type LocationId = KeyOfTuple<typeof LOCATION_NAMES>;
export type LocationName = (typeof LOCATION_NAMES)[number];

export type LocationSelectionCriteria = ConvertTuple<
  typeof LOCATION_NAMES,
  {
    jobSelectionCount: number;
  }
>;

export const nextLocation = (
  location: LocationId | null
): LocationId | null => {
  if (location == null) {
    return null;
  }

  const nextIndex = 1 + location;
  if (nextIndex >= LOCATION_NAMES.length) {
    return null;
  }

  return nextIndex as LocationId;
};
