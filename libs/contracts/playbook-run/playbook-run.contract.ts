import { z } from 'zod';
import { commonResponses, IDSchema, ResponseSchema } from '../common';
import { initContract } from '@ts-rest/core';
import {
  ListPlaybookRunsAttributesSchema,
  PlaybookRunSchema,
  CreatePlaybookRunAttributesSchema,
} from './playbook-run.schema';

const c = initContract();
export const playbookRunContract = c.router(
  {
    listPlaybookRuns: {
      method: 'GET',
      path: '/playbook-runs',
      summary: 'List all playbook runs',
      query: ListPlaybookRunsAttributesSchema,
      responses: {
        200: ResponseSchema(PlaybookRunSchema.array()),
      },
    },
    createPlaybookRun: {
      method: 'POST',
      path: '/playbook-runs',
      summary: 'Create a new playbook run',
      body: CreatePlaybookRunAttributesSchema,
      responses: {
        201: ResponseSchema(PlaybookRunSchema),
      },
    },
    getPlaybookRun: {
      method: 'GET',
      path: '/playbook-runs/:playbookRunId',
      summary: 'Get a playbook run',
      pathParams: z.object({
        playbookRunId: z.string().pipe(IDSchema),
      }),
      responses: {
        200: ResponseSchema(PlaybookRunSchema),
      },
    },
    deletePlaybookRun: {
      method: 'DELETE',
      path: '/playbook-runs/:playbookRunId',
      summary: 'Delete a playbook run',
      pathParams: z.object({
        playbookRunId: z.string().pipe(IDSchema),
      }),
      responses: {
        204: c.noBody(),
      },
    },
  },
  { commonResponses },
);
