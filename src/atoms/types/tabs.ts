export interface Tab {
  label: string;
  value: number | string;
  disabled?: boolean,
  icon?: string,
  iconClass?: string;
  iconType?: string;
  active?: 'online' | 'offline' | null,
}
