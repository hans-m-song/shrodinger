import { z } from 'zod';
import { IDSchema } from '../common';

export const PlaybookSchema = z.object({
  playbookId: IDSchema,
  filepath: z.string(),
  contents: z.record(z.unknown()),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Playbook = z.infer<typeof PlaybookSchema>;

export const ListPlaybooksAttributesSchema = z.object({
  limit: z.coerce.number().int().min(1).default(10),
  offset: z.coerce.number().int().min(0).default(0),
  filepath: z.string().optional(),
});

export type ListPlaybooksAttributes = z.infer<
  typeof ListPlaybooksAttributesSchema
>;

export const CreatePlaybookAttributesSchema = PlaybookSchema.pick({
  filepath: true,
  contents: true,
});

export type CreatePlaybookAttributes = z.infer<
  typeof CreatePlaybookAttributesSchema
>;

export const UpdatePlaybookAttributesSchema =
  CreatePlaybookAttributesSchema.partial();

export type UpdatePlaybookAttributes = z.infer<
  typeof UpdatePlaybookAttributesSchema
>;
