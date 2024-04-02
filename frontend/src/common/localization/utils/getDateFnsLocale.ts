import {Locale} from "date-fns";
import {enGB, hu} from "date-fns/locale";

export const getDateFnsLocale = (locale): Locale => {
  switch (locale.toString().substring(0, 2)) {
    case "en":
      return enGB;
    case "hu":
      return hu;
    default:
      return hu;
  }
}
