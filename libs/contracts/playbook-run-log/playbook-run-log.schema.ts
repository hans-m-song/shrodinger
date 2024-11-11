import { z } from 'zod';
import { IDSchema } from '../common';
import { AnsibleLogBaseSchema } from '../ansible';

export const PlaybookRunLogSchema = z.object({
  playbookRunId: IDSchema,
  sequence: z.number().int().min(0),
  contents: AnsibleLogBaseSchema.passthrough(),
});

export type PlaybookRunLog = z.infer<typeof PlaybookRunLogSchema>;
