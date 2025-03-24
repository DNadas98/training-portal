interface ISiteConfig {
  readonly siteName: string,
  readonly siteURL: string,
  readonly sourceCodeUrl: string,
  readonly defaultLocale: string,
  readonly adminInfo: adminInfo,
}

interface adminInfo {
  readonly name_en: string,
  readonly name_hu: string,
  readonly mail: string,
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
  }
};
export default siteConfig;
