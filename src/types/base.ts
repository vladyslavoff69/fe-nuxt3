export type ID = string | number;

export type DateTime = string;

export type PaginatorInfo = {
  count: number;
  currentPage: number;
  firstItem: number;
  hasMorePages: boolean;
  lastItem: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type SortBy = 'POPULAR' | 'A-Z' | 'Z-A' | 'NEWEST';

export type SelectOptionType = {
  label: string | number;
  value: string | number;
};
