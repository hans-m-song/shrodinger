import { z } from 'zod';
import { IDSchema } from './attributes';

export enum PlaybookRunStatus {
  Pending = 'pending',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
}

export const PlaybookRunStatusSchema = z.nativeEnum(PlaybookRunStatus);

export const PlaybookRunSchema = z.object({
  playbookRunId: IDSchema,
  playbookId: IDSchema,
  status: PlaybookRunStatusSchema,
  contents: z.any(),
  createdAt: z.number(),
  modifiedAt: z.number(),
  startedAt: z.number(),
  completedAt: z.number(),
});

export type PlaybookRun = z.infer<typeof PlaybookRunSchema>;
