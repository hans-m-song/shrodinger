import { PlaybookRunStatusValues } from '@shrodinger/contracts';
import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

const activeRecord = {
  version: t
    .bigint('version', { mode: 'number' })
    .notNull()
    .$default(() => 1)
    .$onUpdate(() => sql`version + 1`),

  createdAt: t
    .bigint('created_at', { mode: 'number' })
    .notNull()
    .$default(() => Date.now()),

  updatedAt: t
    .bigint('updated_at', { mode: 'number' })
    .notNull()
    .$onUpdate(() => Date.now()),
};

export const playbooks = t.pgTable('playbooks', {
  playbookId: t.serial('playbook_id').primaryKey(),
  filepath: t.text('filepath').notNull().unique(),
  contents: t.json('contents').notNull(),
  ...activeRecord,
});

export const playbookRuns = t.pgTable('playbook_runs', {
  playbookRunId: t.serial('playbook_run_id').primaryKey(),
  playbookId: t.integer('playbook_id').references(() => playbooks.playbookId),
  status: t.text('status', { enum: PlaybookRunStatusValues }).notNull(),
  contents: t.text('contents'),
  startedAt: t.integer('started_at'),
  completedAt: t.integer('completed_at'),
  ...activeRecord,
});
