import {useContext} from "react";
import {LocaleContext} from "../context/LocaleProvider.tsx";

export default function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocaleContext must be used within a LocaleProvider");
  }
  return context;
}
