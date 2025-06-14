export interface Filter {
  eq?: number | string | boolean;
  ne?: number | string | boolean;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

export type WhereFilter<T extends object> = {
  [K in keyof T]?: Filter;
};

export interface ListQueryOptions<T extends object> {
  where?: WhereFilter<T>;
  limit?: number;
  offset?: number;
  orderBy?: {
    [K in keyof T]?: 'asc' | 'desc';
  };
}

export type ListEvent<T extends object> = ListQueryOptions<T> | null;
