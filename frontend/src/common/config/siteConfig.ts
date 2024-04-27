interface ISiteConfig {
  readonly siteName: string,
  readonly siteURL: string,
  readonly sourceCodeUrl: string,
  readonly defaultLocale: string,
  readonly adminInfo: adminInfo,
  readonly developerInfo: developerInfo
}

interface adminInfo {
  readonly name_en: string,
  readonly name_hu: string,
  readonly mail: string,
}

interface developerInfo {
  readonly name_en: string,
  readonly name_hu: string,
  readonly mail: string,
  readonly portfolioUrl: string,
  readonly portfolioTitle: string
}

const siteConfig: ISiteConfig = {
  siteName: "tesztsor.hu",
  siteURL: "https://tesztsor.hu",
  sourceCodeUrl: "https://github.com/DNadas98/training-portal",
  defaultLocale: "huHU",
  adminInfo: {
    name_en: "Ferenc Nádas",
    name_hu: "Nádas Ferenc",
    mail: "tesztsor@fnadas.net"
  },
  developerInfo: {
    name_en: "Dániel Nádas",
    name_hu: "Nádas Dániel",
    mail: "daniel.nadas@dnadas.net",
    portfolioUrl: "https://dnadas.net",
    portfolioTitle: "dnadas.net"
  }
};
export default siteConfig;
