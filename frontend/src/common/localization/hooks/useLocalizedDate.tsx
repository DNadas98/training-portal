import useLocaleContext from "./useLocaleContext.tsx";

export default function useLocalizedDate() {
  const {locale} = useLocaleContext();

  const getLocalizedDate = (date: Date) => {
    if (!locale || locale.length < 2) {
      return date.toLocaleDateString();
    }
    return date.toLocaleDateString(locale.toString().substring(0, 2));
  }

  return getLocalizedDate;
}
