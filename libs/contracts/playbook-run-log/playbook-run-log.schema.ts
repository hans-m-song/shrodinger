import { z } from 'zod';
import { RangeSchema, IDSchema, PaginationSchema } from '../common';

export const PlaybookRunLogSchema = z.object({
  playbookRunId: IDSchema,
  sequence: z.number().int().min(0),
  contents: z.record(z.unknown()),
});

export type PlaybookRunLog = z.infer<typeof PlaybookRunLogSchema>;

export const ListPlaybookRunLogsAttributesSchema = z
  .object({
    playbookRunId: PlaybookRunLogSchema.shape.playbookRunId,
    sequence: RangeSchema.optional(),
  })
  .merge(PaginationSchema);

export type ListPlaybookRunLogsAttributes = z.infer<
  typeof ListPlaybookRunLogsAttributesSchema
>;
