import { z } from 'zod';
import { commonResponses, IDSchema, ResponseSchema } from '../common';
import { initContract } from '@ts-rest/core';
import {
  ListPlaybooksQuerySchema,
  PlaybookSchema,
  UpdatePlaybookBodySchema,
} from './playbook.schema';

const c = initContract();
export const playbookContract = c.router(
  {
    listPlaybooks: {
      summary: 'List all playbooks',
      method: 'GET',
      path: '/playbooks',
      query: ListPlaybooksQuerySchema,
      responses: {
        200: ResponseSchema(PlaybookSchema.array()),
      },
    },
    getPlaybook: {
      summary: 'Get a playbook',
      method: 'GET',
      path: '/playbooks/:playbookId',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(IDSchema),
      }),
      responses: {
        200: ResponseSchema(PlaybookSchema),
      },
    },
    updatePlaybook: {
      summary: 'Update a playbook',
      method: 'PATCH',
      path: '/playbooks/:playbookId',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(IDSchema),
      }),
      body: UpdatePlaybookBodySchema,
      responses: {
        200: ResponseSchema(PlaybookSchema),
      },
    },
  },
  { commonResponses },
);
