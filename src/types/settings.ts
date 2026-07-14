export type AppLocale = "pt-BR" | "en-US" | "es-419";

export interface AppSettings {
  locale: AppLocale;
  theme: "light" | "dark" | "system";
  showTechnologyBadges: boolean;
  defaultLicense: string;
  autoSaveDrafts: boolean;
}
