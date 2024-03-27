import {createContext, ReactNode, useEffect, useState} from 'react';
import {ILocaleContext} from "./ILocaleContext.ts";
import {SupportedLocaleType} from "./SupportedLocaleType.ts";

export const LocaleContext = createContext<ILocaleContext | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

const getLocaleFromLocalStorage = (): SupportedLocaleType | null => {
  const storedLocale = localStorage.getItem('locale');
  return storedLocale ? (storedLocale as SupportedLocaleType) : null;
};

const setLocaleToLocalStorage = (locale: SupportedLocaleType) => {
  localStorage.setItem('locale', locale);
};

export function LocaleProvider({children}: LocaleProviderProps) {
  const defaultLocale: SupportedLocaleType = "huHU";
  const [locale, setLocale] = useState<SupportedLocaleType>(() => {
    const storedLocale = getLocaleFromLocalStorage();
    return storedLocale || defaultLocale;
  });

  useEffect(() => {
    setLocaleToLocalStorage(locale);
  }, [locale]);

  return (
    <LocaleContext.Provider value={{locale, setLocale}}>
      {children}
    </LocaleContext.Provider>
  );
}
