export type MetaPaginate = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type LinksPaginate = {
  first: string;
  previous: string;
  next: string;
  last: string;
};

export type Pagination = {
  limit: number;
  offset: number;
  count: number;
  currentPage: number;
  totalPages: number;
};

export type QueryParams = {
  page: number;
  limit: number;
  offset: number;
  firstName: string;
};

export function paginateResponse(data: any, page: number, limit: number) {
  const [result, total] = data;
  const lastPage = Math.ceil(total / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    items: [...result],
    count: total,
    currentPage: page,
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
  };
}
