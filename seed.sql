INSERT
  OR REPLACE INTO playbooks (playbook_id, filepath, contents)
VALUES (0, 'foo', '{"foo":"foo"}'),
  (1, 'bar', '{"bar":"bar"}'),
  (2, 'baz', '{"baz":"baz"}'),
  (3, 'qux', '{"qux":"qux"}');

SELECT 'playbooks',
  COUNT(*)
FROM playbooks;

INSERT
  OR REPLACE INTO playbook_runs (playbook_run_id, playbook_id, STATUS, contents)
VALUES (0, 0, 'pending', 'blah'),
  (1, 0, 'running', 'blah'),
  (2, 0, 'completed', 'blah');

SELECT 'playbook_runs',
  COUNT(*)
FROM playbook_runs;
