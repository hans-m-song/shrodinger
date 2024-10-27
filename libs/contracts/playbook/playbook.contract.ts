import { z } from 'zod';
import { commonResponses, IDSchema, ResponseSchema } from '../common';
import { initContract } from '@ts-rest/core';
import {
  ListPlaybooksAttributesSchema,
  PlaybookSchema,
  CreatePlaybookAttributesSchema,
} from './playbook.schema';

const c = initContract();
export const playbookContract = c.router(
  {
    listPlaybooks: {
      method: 'GET',
      path: '/playbooks',
      summary: 'List all playbooks',
      query: ListPlaybooksAttributesSchema,
      responses: {
        200: ResponseSchema(PlaybookSchema.array()),
      },
    },
    createPlaybook: {
      method: 'POST',
      path: '/playbooks',
      summary: 'Create a new playbook',
      body: CreatePlaybookAttributesSchema,
      responses: {
        201: ResponseSchema(PlaybookSchema),
      },
    },
    getPlaybook: {
      method: 'GET',
      path: '/playbooks/:playbookId',
      summary: 'Get a playbook',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(IDSchema),
      }),
      responses: {
        200: ResponseSchema(PlaybookSchema),
      },
    },
    updatePlaybook: {
      method: 'PATCH',
      path: '/playbooks/:playbookId',
      summary: 'Update a playbook',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(IDSchema),
      }),
      body: PlaybookSchema,
      responses: {
        200: ResponseSchema(PlaybookSchema),
      },
    },
    deletePlaybook: {
      method: 'DELETE',
      path: '/playbooks/:playbookId',
      summary: 'Delete a playbook',
      pathParams: z.object({
        playbookId: z.coerce.number().pipe(IDSchema),
      }),
      responses: {
        204: c.noBody(),
      },
    },
  },
  { commonResponses },
);
