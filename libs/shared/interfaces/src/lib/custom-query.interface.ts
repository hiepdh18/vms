export interface CustomFilter {
  field: string;
  value: string;
  operator: string;
  matchCase?: string;
}
export interface FilterObject {
  [x: string]: {
    field: string;
    operation: string;
    value: string | any;
    matchCase?: string;
  };
}

export interface CustomSorter {
  field: string;
  direction: 'asc' | 'desc';
}

export interface CustomQuery {
  filters: FilterObject;
  sorters: CustomSorter[];
  page: number;
  pageSize: number;
}
