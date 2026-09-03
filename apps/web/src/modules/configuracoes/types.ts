export type SettingsSectionId =
  | "aparencia"
  | "usuarios"
  | "perfil"
  | "filiais"
  | "notificacoes"
  | "conexoes"
  | "geral";

export interface SettingsSectionDef {
  id: SettingsSectionId;
  label: string;
  iconName: string;
  iconBg: string; // Tailwind class for squircle background
  subtitle?: string;
}
