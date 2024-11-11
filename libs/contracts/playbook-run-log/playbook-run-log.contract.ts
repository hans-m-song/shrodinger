import { initContract } from '@ts-rest/core';
import {
  commonResponses,
  IDSchema,
  PaginationSchema,
  RangeSchema,
  ResponseSchema,
} from '../common';
import { z } from 'zod';
import { PlaybookRunLogSchema } from './playbook-run-log.schema';

const c = initContract();
export const playbookRunLogContract = c.router(
  {
    listPlaybookRunLogs: {
      summary: 'List logs for a playbook run',
      method: 'GET',
      path: '/playbooks/:playbookId/runs/:playbookRunId/logs',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(IDSchema),
        playbookRunId: z.coerce.number().pipe(IDSchema),
      }),
      query: z
        .object({
          sequence: RangeSchema.optional(),
        })
        .merge(PaginationSchema),
      responses: {
        200: ResponseSchema(PlaybookRunLogSchema.array()),
      },
    },
  },
  { commonResponses },
);
