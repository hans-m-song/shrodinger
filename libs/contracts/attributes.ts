import { z } from 'zod';

export const IDSchema = z.number().int().min(0);

export type ID = z.infer<typeof IDSchema>;
