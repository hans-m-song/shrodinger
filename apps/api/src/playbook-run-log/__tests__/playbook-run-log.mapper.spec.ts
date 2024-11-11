import { Logger } from '../../logger';
import { PlaybookRunLogMapper } from '../playbook-run-log.mapper';
import * as playbookRunLogFixture from '../../../test/fixtures/playbook-run-logs.json';
import { setLogging } from '../../../test/mocks/logger';

describe('PlaybookRunLogMapper', () => {
  const mapper = new PlaybookRunLogMapper(
    new Logger(PlaybookRunLogMapper.name),
  );

  describe('flatten', () => {
    it('should flatten playbook run logs', () => {
      setLogging(true);
      // given
      const logs = playbookRunLogFixture.map((log) => ({
        playbookRunId: 1,
        ...log,
      }));

      // when
      const result = mapper.flatten(logs);

      // then
      expect(result).toMatchSnapshot();
    });
  });
});
