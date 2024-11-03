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
      summary: 'List all playbooks',
      method: 'GET',
      path: '/playbooks',
      query: ListPlaybooksAttributesSchema,
      responses: {
        200: ResponseSchema(PlaybookSchema.array()),
      },
    },
    createPlaybook: {
      summary: 'Create a new playbook',
      method: 'POST',
      path: '/playbooks',
      body: CreatePlaybookAttributesSchema,
      responses: {
        201: ResponseSchema(PlaybookSchema),
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
      body: PlaybookSchema,
      responses: {
        200: ResponseSchema(PlaybookSchema),
      },
    },
    deletePlaybook: {
      summary: 'Delete a playbook',
      method: 'DELETE',
      path: '/playbooks/:playbookId',
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
