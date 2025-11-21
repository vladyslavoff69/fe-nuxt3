export type PromoCardImage = {
  url: string,
  class?: string
}
export type PromoCard = {
  id: number | string;
  name: string;
  slug: string;
  total_prize: string;
  valid_for: string;
  time_frame: string;
  caption: string;
  image: string;
  end_date: string;
  start_date: string;
  redirect_url: string;
  cover: string;
  headerHtml: string,
  cardTitle: string,
  subHeader: string,
  period?: string,
  duration?: string
  tags: string[],
  cardImage?: PromoCardImage
  desktopImage?: PromoCardImage
  prize?: string
  description: string
  prizeDistribution: any[],
  additionalDetails: any[],
  numberOfWinners: string
  objective: string
  promo_code?: string,
  button?: any,
  promotion_prizes?: any
};
