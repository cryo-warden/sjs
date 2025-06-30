import { JobId } from "@/logic/Job";
import { useLanguage } from "./LanguageContext";

// TODO Show the estimated average power level of the current party.
export const JobList = ({ jobs }: { jobs: JobId[] }) => {
  const language = useLanguage();
  return (
    <>
      {jobs.map((job, i) => (
        <div key={i}>{language.jobNames[job]}</div>
      ))}
    </>
  );
};
