import { z } from 'zod';
import {
  ActiveRecordSchema,
  EpochSchema,
  IDSchema,
  ListActiveRecordsSchema,
  PaginationSchema,
  RangeSchema,
} from '../common';

export enum PlaybookRunStatus {
  Pending = 'pending',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

export const nextPlaybookRunStatus = {
  [PlaybookRunStatus.Pending]: PlaybookRunStatus.Running,
  [PlaybookRunStatus.Running]: PlaybookRunStatus.Completed,
  [PlaybookRunStatus.Completed]: PlaybookRunStatus.Completed,
  [PlaybookRunStatus.Failed]: PlaybookRunStatus.Failed,
};

export const PlaybookRunStatusValues = [
  PlaybookRunStatus.Pending,
  PlaybookRunStatus.Running,
  PlaybookRunStatus.Completed,
  PlaybookRunStatus.Failed,
] as const;

export const PlaybookRunStatusSchema = z.nativeEnum(PlaybookRunStatus);

export const PlaybookRunSchema = z
  .object({
    playbookRunId: IDSchema,
    playbookId: IDSchema,
    playbookVersion: ActiveRecordSchema.shape.version,
    status: PlaybookRunStatusSchema,
    startedAt: EpochSchema.nullable(),
    completedAt: EpochSchema.nullable(),
  })
  .merge(ActiveRecordSchema);

export type PlaybookRun = z.infer<typeof PlaybookRunSchema>;

export const ListPlaybookRunsQuerySchema = z
  .object({
    status: z.coerce.string().pipe(PlaybookRunSchema.shape.status).optional(),
    playbookId: z.coerce
      .number()
      .pipe(PlaybookRunSchema.shape.playbookId)
      .optional(),
    startedAt: RangeSchema.optional(),
    completedAt: RangeSchema.optional(),
  })
  .merge(PaginationSchema)
  .merge(ListActiveRecordsSchema);

export type ListPlaybookRunsQuery = z.infer<typeof ListPlaybookRunsQuerySchema>;

export const CreatePlaybookRunBodySchema = z.object({
  playbookId: PlaybookRunSchema.shape.playbookId,
  playbookVersion: PlaybookRunSchema.shape.playbookVersion,
});

export type CreatePlaybookRunBody = z.infer<typeof CreatePlaybookRunBodySchema>;
