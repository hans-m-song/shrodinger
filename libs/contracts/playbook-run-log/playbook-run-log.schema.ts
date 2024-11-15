import { z } from 'zod';
import { IDSchema } from '../common';
import { AnsibleLogSchema } from '../ansible';

export const PlaybookRunLogSchema = z.object({
  playbookRunId: IDSchema,
  sequence: z.number().int().min(0),
  contents: AnsibleLogSchema,
});

export type PlaybookRunLog = z.infer<typeof PlaybookRunLogSchema>;
