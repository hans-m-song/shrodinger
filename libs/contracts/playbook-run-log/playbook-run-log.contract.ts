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
      summary: 'List logs for a playbook run',
      method: 'GET',
      path: '/playbooks/:playbookId/runs/:playbookRunId/logs',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(IDSchema),
        playbookRunId: z.coerce.number().pipe(IDSchema),
      }),
      query: ListPlaybookRunLogsAttributesSchema,
      responses: {
        200: ResponseSchema(PlaybookRunLogSchema.array()),
      },
    },
  },
  { commonResponses },
);
