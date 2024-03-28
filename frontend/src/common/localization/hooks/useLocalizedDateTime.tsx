import useLocaleContext from "./useLocaleContext.tsx";

export default function useLocalizedDateTime() {
  const {locale} = useLocaleContext();

  const getLocalizedDateTime = (date: Date) => {
    if (!locale || locale.length < 2) {
      return date.toLocaleString();
    }
    return date.toLocaleString(locale.toString().substring(0, 2));
  }

  return getLocalizedDateTime;
}
