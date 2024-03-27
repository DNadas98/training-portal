import {SupportedLocaleType} from "./SupportedLocaleType.ts";

export interface ILocaleContext {
  locale: SupportedLocaleType;
  setLocale: (locale: SupportedLocaleType) => void;
}
