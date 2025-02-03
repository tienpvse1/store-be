import { SelectCallback, SelectQueryBuilder } from 'kysely';
import { DB } from 'kysely-codegen';

export type PaginationOptions = { page?: number; pageSize?: number };
export type PaginationResult<T> = {
  data: T[];
  count: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasNextPage: boolean;
};

export async function withPagination<
  I extends keyof DB,
  O,
  CB extends SelectCallback<DB, I>,
>(query: SelectQueryBuilder<DB, I, O>, options: PaginationOptions, cb: CB) {
  const { page = 1, pageSize = 10 } = options;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const data = await query.select(cb).offset(offset).limit(limit).execute();
  const countResult = await query
    .select((eb) => eb.fn.countAll().as('count'))
    .executeTakeFirst();
  const count = Number.parseInt(countResult.count.toString());
  return {
    data,
    count: data.length,
    pageSize: limit,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
    hasNextPage: count > offset + limit,
  };
}
