import { z } from 'zod';
import { IDSchema } from './attributes';

export const PlaybookSchema = z.object({
  playbookId: IDSchema,
  filepath: z.string(),
  contents: z.any(),
  createdAt: z.number(),
  modifiedAt: z.number(),
});

export type Playbook = z.infer<typeof PlaybookSchema>;
