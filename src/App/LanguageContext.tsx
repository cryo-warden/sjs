import { language } from "@/language/en";
import { Language } from "@/language/Language";
import { createContext, ReactNode, useContext } from "react";

const LanguageContext = createContext<Language>(null as any);

export const WithLanguageContext = ({ children }: { children: ReactNode }) => {
  // TODO Make each language a separate entrypoint and select according to browser settings.
  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
