import {
  PlaybookRunStatus,
  PlaybookRunStatusValues,
} from '@shrodinger/contracts';
import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

const activeRecord = {
  version: t
    .bigint('version', { mode: 'number' })
    .notNull()
    .default(sql`1`)
    .$onUpdateFn(() => sql`version + 1`),

  createdAt: t
    .bigint('created_at', { mode: 'number' })
    .notNull()
    .default(sql`extract(epoch from current_timestamp)`),

  updatedAt: t
    .bigint('updated_at', { mode: 'number' })
    .notNull()
    .default(sql`extract(epoch from current_timestamp)`)
    .$onUpdateFn(() => Date.now()),
};

export const playbooks = t.pgTable('playbooks', {
  playbookId: t.serial('playbook_id').primaryKey(),
  filepath: t.text('filepath').notNull().unique(),
  contents: t.json('contents').notNull(),
  active: t.boolean('active').notNull().default(true),
  ...activeRecord,
});

export const playbookRuns = t.pgTable('playbook_runs', {
  playbookRunId: t.serial('playbook_run_id').primaryKey(),
  playbookId: t.integer('playbook_id').references(() => playbooks.playbookId),
  status: t
    .text('status', { enum: PlaybookRunStatusValues })
    .notNull()
    .default(PlaybookRunStatus.Pending),
  startedAt: t.integer('started_at'),
  completedAt: t.integer('completed_at'),
  ...activeRecord,
});

export const playbookRunLogs = t.pgTable(
  'playbook_run_logs',
  {
    playbookRunId: t
      .integer('playbook_run_id')
      .references(() => playbookRuns.playbookRunId)
      .notNull(),
    sequence: t.serial('sequence').notNull(),
    contents: t.json('contents'),
  },
  (table) => ({
    pk: t.primaryKey({ columns: [table.playbookRunId, table.sequence] }),
  }),
);

export const playbooksRelations = relations(playbooks, (r) => ({
  playbookRuns: r.many(playbookRuns),
}));

export const playbookRunsRelations = relations(playbookRuns, (r) => ({
  playbooks: r.one(playbooks, {
    fields: [playbookRuns.playbookId],
    references: [playbooks.playbookId],
  }),
  playbookRunLogs: r.many(playbookRunLogs),
}));

export const playbookRunLogsRelations = relations(playbookRunLogs, (r) => ({
  playbookRuns: r.one(playbookRuns, {
    fields: [playbookRunLogs.playbookRunId],
    references: [playbookRuns.playbookRunId],
  }),
}));
