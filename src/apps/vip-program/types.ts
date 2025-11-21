export type VipTreatment = {
  title: string;
  description: string;
  image: string;
  tooltip: string;
  key: string;
}

export type VipLevelSlider = {
  name: string,
  image: string;
  color?: string;
  levels: { levelName: string; }[]
}
