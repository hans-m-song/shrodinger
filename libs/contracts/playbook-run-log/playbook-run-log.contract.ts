import { initContract } from '@ts-rest/core';
import { commonResponses, IDSchema, ResponseSchema } from '../common';
import {
  ListPlaybookRunLogsAttributesSchema,
  PlaybookRunLogSchema,
} from './playbook-run-log.schema';
import { z } from 'zod';

const c = initContract();
export const playbookRunLogContract = c.router(
  {
    listPlaybookRunLogs: {
      method: 'GET',
      path: '/playbook-runs/:playbookRunId/logs',
      summary: 'List logs for a playbook run',
      query: ListPlaybookRunLogsAttributesSchema,
      pathParams: z.object({
        playbookRunId: z.coerce.number().pipe(IDSchema),
      }),
      responses: {
        200: ResponseSchema(PlaybookRunLogSchema.array()),
      },
    },
  },
  { commonResponses },
);
