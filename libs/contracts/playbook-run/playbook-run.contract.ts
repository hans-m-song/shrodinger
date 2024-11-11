import { z } from 'zod';
import { commonResponses, IDSchema, ResponseSchema } from '../common';
import { initContract } from '@ts-rest/core';
import {
  CreatePlaybookRunBodySchema,
  ListPlaybookRunsQuerySchema,
  PlaybookRunSchema,
} from './playbook-run.schema';

const c = initContract();
export const playbookRunContract = c.router(
  {
    listPlaybookRuns: {
      summary: 'List all playbook runs',
      method: 'GET',
      path: '/playbooks/:playbookId/runs',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(IDSchema),
      }),
      query: ListPlaybookRunsQuerySchema,
      responses: {
        200: ResponseSchema(PlaybookRunSchema.array()),
      },
    },
    createPlaybookRun: {
      summary: 'Create a new playbook run',
      method: 'POST',
      path: '/playbooks/:playbookId/runs',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(PlaybookRunSchema.shape.playbookId),
      }),
      body: CreatePlaybookRunBodySchema,
      responses: {
        201: ResponseSchema(PlaybookRunSchema),
      },
    },
    getPlaybookRun: {
      summary: 'Get a playbook run',
      method: 'GET',
      path: '/playbooks/:playbookId/runs/:playbookRunId',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(PlaybookRunSchema.shape.playbookId),
        playbookRunId: z.coerce
          .number()
          .pipe(PlaybookRunSchema.shape.playbookRunId),
      }),
      responses: {
        200: ResponseSchema(PlaybookRunSchema),
      },
    },
    deletePlaybookRun: {
      summary: 'Delete a playbook run',
      method: 'DELETE',
      path: '/playbooks/:playbookId/runs/:playbookRunId',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(PlaybookRunSchema.shape.playbookId),
        playbookRunId: z.coerce
          .number()
          .pipe(PlaybookRunSchema.shape.playbookRunId),
      }),
      responses: {
        204: c.noBody(),
      },
    },
  },
  { commonResponses },
);
