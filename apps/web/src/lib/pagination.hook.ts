import { useState } from 'react';

export interface Pagination {
  page: number;
  pageSize: number;
}

export const usePagination = (initial?: Partial<Pagination>) => {
  const [pagination, setPagination] = useState<Pagination>({
    page: initial?.page ?? 0,
    pageSize: initial?.pageSize ?? 10,
  });

  const setPage = (page: number) => {
    setPagination((state) => ({ ...state, page }));
  };

  const setPageSize = (pageSize: number) => {
    setPagination((state) => ({ ...state, pageSize }));
  };

  const nextPage = () => {
    setPagination((state) => ({ ...state, page: state.page + 1 }));
  };

  const previousPage = () => {
    setPagination((state) => ({ ...state, page: Math.max(0, state.page - 1) }));
  };

  return {
    pagination,
    setPagination,

    setPage,
    setPageSize,

    nextPage,
    previousPage,
  };
};
