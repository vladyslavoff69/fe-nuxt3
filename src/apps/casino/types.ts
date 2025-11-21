export type CategoryProvidersBaseRow = {
  id: string;
  title: string;
  icon: string;
  iconType: string;
  enabled: boolean;
}

export type CategoryRow = CategoryProvidersBaseRow & {
  type: 'category';
  categorySlug: string;
}

export type ProvidersRow = CategoryProvidersBaseRow & {
  type: 'providers';
}

export type CurrencyRow = {
  type: 'currencies';
}
