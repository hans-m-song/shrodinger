import { z } from 'zod';

export const PaginationSchema = z.object({
  limit: z.number().int().min(1).default(10),
  offset: z.number().int().min(0).default(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;
