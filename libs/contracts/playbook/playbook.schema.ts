import { z } from 'zod';
import {
  IDSchema,
  ActiveRecordSchema,
  PaginationSchema,
  ListActiveRecordsSchema,
} from '../common';

export const PlaybookSchema = z
  .object({
    playbookId: IDSchema,
    active: z.boolean().default(true),
    filepath: z.string(),
  })
  .merge(ActiveRecordSchema);

export type Playbook = z.infer<typeof PlaybookSchema>;

export const ListPlaybooksQuerySchema = z
  .object({
    active: z.coerce.boolean().optional(),
    filepath: z.coerce.string().optional(),
  })
  .merge(PaginationSchema)
  .merge(ListActiveRecordsSchema);

export type ListPlaybooksQuery = z.infer<typeof ListPlaybooksQuerySchema>;

export const UpdatePlaybookBodySchema = z.object({
  active: PlaybookSchema.shape.active,
});

export type UpdatePlaybookBody = z.infer<typeof UpdatePlaybookBodySchema>;
