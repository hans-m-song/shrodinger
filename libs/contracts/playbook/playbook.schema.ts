import { z } from 'zod';
import {
  IDSchema,
  PaginationSchema,
  EpochRangeSchema,
  ActiveRecordSchema,
} from '../common';

export const PlaybookSchema = z
  .object({
    playbookId: IDSchema,
    filepath: z.string(),
    contents: z.record(z.unknown()),
    createdAt: z.number(),
    updatedAt: z.number(),
  })
  .merge(ActiveRecordSchema);

export type Playbook = z.infer<typeof PlaybookSchema>;

export const ListPlaybooksAttributesSchema = z
  .object({
    filepath: PlaybookSchema.shape.filepath.optional(),
    createdAt: EpochRangeSchema.optional(),
    updatedAt: EpochRangeSchema.optional(),
  })
  .merge(PaginationSchema);

export type ListPlaybooksAttributes = z.infer<
  typeof ListPlaybooksAttributesSchema
>;

export const CreatePlaybookAttributesSchema = z.object({
  filepath: PlaybookSchema.shape.filepath,
  contents: PlaybookSchema.shape.contents,
});

export type CreatePlaybookAttributes = z.infer<
  typeof CreatePlaybookAttributesSchema
>;

export const UpdatePlaybookAttributesSchema = z.object({
  playbookId: PlaybookSchema.shape.playbookId,
  filepath: PlaybookSchema.shape.filepath.optional(),
  contents: PlaybookSchema.shape.contents.optional(),
});

export type UpdatePlaybookAttributes = z.infer<
  typeof UpdatePlaybookAttributesSchema
>;
