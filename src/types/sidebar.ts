export type MenuItem = {
  type: string;
  key: string;
  url?: string;
  path?: string;
  icon?: any;
  class?: string;
  iconType?: string;
  iconClass?: string;
  items?: {
    type: string;
    key?: string;
    url?: string;
    link?: string;
    label?: string;
    icon?: any;
    iconType?: string;
    iconClass?: string;
    path?: string;
    state?: string;
    enabled?: boolean;
  }[];
}
