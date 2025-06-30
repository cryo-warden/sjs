import { useLanguage } from "./LanguageContext";

export const Header = () => {
  const language = useLanguage();
  return (
    <header className="Header">
      <h1 className="mood-chill left-align">{language.blobRecord.title}</h1>
      <h2 className="mood-respect right-align">{language.blobRecord.ff5}</h2>
    </header>
  );
};
