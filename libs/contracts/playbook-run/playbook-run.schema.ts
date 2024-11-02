import { z } from 'zod';
import {
  ActiveRecordSchema,
  EpochSchema,
  IDSchema,
  PaginationSchema,
  EpochRangeSchema,
} from '../common';

export enum PlaybookRunStatus {
  Pending = 'pending',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

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
    status: PlaybookRunStatusSchema,
    startedAt: EpochSchema.nullable(),
    completedAt: EpochSchema.nullable(),
  })
  .merge(ActiveRecordSchema);

export type PlaybookRun = z.infer<typeof PlaybookRunSchema>;

export const ListPlaybookRunsAttributesSchema = z
  .object({
    status: PlaybookRunStatusSchema.optional(),
    playbookId: IDSchema.optional(),
    createdAt: EpochRangeSchema.optional(),
    updatedAt: EpochRangeSchema.optional(),
    startedAt: EpochRangeSchema.optional(),
    completedAt: EpochRangeSchema.optional(),
  })
  .merge(PaginationSchema);

export type ListPlaybookRunsAttributes = z.infer<
  typeof ListPlaybookRunsAttributesSchema
>;

export const CreatePlaybookRunAttributesSchema = z.object({
  playbookId: PlaybookRunSchema.shape.playbookId,
  status: PlaybookRunSchema.shape.status.optional(),
});

export type CreatePlaybookRunAttributes = z.infer<
  typeof CreatePlaybookRunAttributesSchema
>;

export const UpdatePlaybookRunAttributesSchema = z.object({
  playbookRunId: PlaybookRunSchema.shape.playbookRunId,
  status: PlaybookRunSchema.shape.status.optional(),
  startedAt: PlaybookRunSchema.shape.startedAt.optional(),
  updatedAt: PlaybookRunSchema.shape.updatedAt.optional(),
});

export type UpdatePlaybookRunAttributes = z.infer<
  typeof UpdatePlaybookRunAttributesSchema
>;
