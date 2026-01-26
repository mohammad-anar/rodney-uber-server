export interface ICategory {
  name: string;
  image: string;
}

export interface IQueryParams {
  searchTerm?: string;
  sort?: string;
  page?: number;
  limit?: number;
  fields?: string;
  [key: string]: any;
}
