import {texts} from "../texts.ts";
import useLocaleContext from "./useLocaleContext.tsx";

export default function useLocalized() {
  const localeTexts = texts;
  const {locale} = useLocaleContext();
  const getLocalized = (keystring: string): string => {
    if (!localeTexts) {
      return "";
    }
    let localizedText = localeTexts[locale];
    const keys = keystring?.split(".");
    for (const k of keys) {
      if (!localizedText || !localizedText[k]) {
        return "";
      }
      localizedText = localizedText[k];
    }
    return localizedText;
  };

  return getLocalized;
}
