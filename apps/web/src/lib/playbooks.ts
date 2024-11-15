import { gql, useQuery } from '@apollo/client';
import { Playbook } from '@shrodinger/contracts';

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
          playbookId
          active
          filepath
          createdAt
          updatedAt
        }
      }
    `,
    { variables },
  );

  return { loading, error, data: data?.playbooks };
};
