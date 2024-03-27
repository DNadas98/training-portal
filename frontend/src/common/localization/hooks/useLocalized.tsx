import {useEffect, useState} from 'react';
import {texts} from "../texts.ts";
import useLocaleContext from "./useLocaleContext.tsx";

export default function useLocalized() {
  const [localeTexts, setLocaleTexts] = useState<any>(null);
  const {locale} = useLocaleContext();

  useEffect(() => {
    setLocaleTexts(texts);
  }, [locale]);
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
