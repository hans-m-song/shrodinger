import { gql, useQuery } from '@apollo/client';
import { z } from 'zod';

export const PlaybookSchema = z.object({
  id: z.string(),
  filepath: z.string(),
  contents: z.any(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Playbook = z.infer<typeof PlaybookSchema>;

export interface useListPlaybooksQueryVariables {
  offset?: number;
  limit?: number;
}

export const useListPlaybooksQuery = (
  variables?: useListPlaybooksQueryVariables,
) => {
  const { loading, error, data } = useQuery<
    { playbooks: Playbook[] },
    useListPlaybooksQueryVariables
  >(
    gql`
      query ($offset: Int, $limit: Int) {
        playbooks(offset: $offset, limit: $limit) {
          id
          filepath
          contents
          createdAt
          updatedAt
        }
      }
    `,
    { variables },
  );

  return { loading, error, data: data?.playbooks };
};
