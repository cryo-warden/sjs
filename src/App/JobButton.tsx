import { LocationId } from "@/logic/Location";
import { select } from "@/logic/Selection";
import { ReactNode } from "react";
import { useCriteria, useParty, useSetParty } from "./StateContext";
import "./JobButton.css";

export const JobButton = ({
  children,
  location,
}: {
  children: ReactNode;
  location: LocationId;
}) => {
  const criteria = useCriteria();
  const party = useParty();
  const setParty = useSetParty();
  return (
    <button
      className="JobButton"
      disabled={location != party.location}
      onClick={() => {
        const { nextPartyState } = select(criteria, party);
        setParty(nextPartyState);
      }}
    >
      {children}
    </button>
  );
};
