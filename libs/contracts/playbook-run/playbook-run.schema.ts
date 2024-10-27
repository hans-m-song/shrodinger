import { z } from 'zod';
import { IDSchema } from '../common';
import { PaginationSchema } from '../pagination';

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

export const PlaybookRunSchema = z.object({
  playbookRunId: IDSchema,
  playbookId: IDSchema,
  status: PlaybookRunStatusSchema,
  contents: z.any(),
  createdAt: z.number(),
  updatedAt: z.number(),
  startedAt: z.number().nullable(),
  completedAt: z.number().nullable(),
});

export type PlaybookRun = z.infer<typeof PlaybookRunSchema>;

export const ListPlaybookRunsAttributesSchema = PaginationSchema.extend({
  status: PlaybookRunStatusSchema.optional(),
  playbookId: IDSchema.optional(),
});

export type ListPlaybookRunsAttributes = z.infer<
  typeof ListPlaybookRunsAttributesSchema
>;

export const CreatePlaybookRunAttributesSchema = z.object({
  playbookId: IDSchema,
  status: PlaybookRunStatusSchema,
  contents: z.any(),
});

export type CreatePlaybookRunAttributes = z.infer<
  typeof CreatePlaybookRunAttributesSchema
>;

export const UpdatePlaybookRunAttributesSchema = z.object({
  status: PlaybookRunStatusSchema.optional(),
  contents: z.any(),
});

export type UpdatePlaybookRunAttributes = z.infer<
  typeof UpdatePlaybookRunAttributesSchema
>;
