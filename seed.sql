INSERT
  OR REPLACE INTO playbooks (id, filepath, contents)
VALUES ('foo', 'foo', '{"foo":"foo"}'),
  ('bar', 'bar', '{"bar":"bar"}'),
  ('baz', 'baz', '{"baz":"baz"}'),
  ('qux', 'qux', '{"qux":"qux"}');

SELECT 'playbooks',
  COUNT(*)
FROM playbooks;
