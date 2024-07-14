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
  skip?: number;
  take?: number;
}

export const useListPlaybooksQuery = (
  variables?: useListPlaybooksQueryVariables,
) => {
  const { loading, error, data } = useQuery<
    { playbooks: Playbook[] },
    useListPlaybooksQueryVariables
  >(
    gql`
      query ($skip: Int, $take: Int) {
        playbooks(skip: $skip, take: $take) {
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
