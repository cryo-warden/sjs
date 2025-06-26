import { ConvertTuple } from "./type";

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

export type LocationName = (typeof LOCATION_NAMES)[number];

export type LocationSelectionCriteria = ConvertTuple<
  typeof LOCATION_NAMES,
  {
    jobSelectionCount: number;
  }
>;

export const nextLocationName = (
  locationName: LocationName | null
): LocationName | null => {
  if (locationName == null) {
    return null;
  }

  const nextIndex = 1 + LOCATION_INDEXES[locationName];
  if (nextIndex >= LOCATION_NAMES.length) {
    return null;
  }

  return LOCATION_NAMES[nextIndex];
};
