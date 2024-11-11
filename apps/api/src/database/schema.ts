import {
  PlaybookRunStatus,
  PlaybookRunStatusValues,
} from '@shrodinger/contracts';
import { InferSelectModel, relations, sql } from 'drizzle-orm';
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
    .default(sql`EXTRACT(epoch FROM CURRENT_TIMESTAMP)`),

  updatedAt: t
    .bigint('updated_at', { mode: 'number' })
    .notNull()
    .default(sql`EXTRACT(epoch FROM CURRENT_TIMESTAMP)`)
    .$onUpdateFn(() => Date.now()),
};

export const playbooks = t.pgTable('playbooks', {
  playbookId: t.serial('playbook_id').primaryKey(),
  active: t.boolean('active').notNull().default(true),
  filepath: t.text('filepath').notNull().unique(),
  ...activeRecord,
});

export type PlaybookAttributes = InferSelectModel<typeof playbooks>;

export const playbookRuns = t.pgTable('playbook_runs', {
  playbookRunId: t.serial('playbook_run_id').primaryKey(),
  playbookId: t
    .integer('playbook_id')
    .notNull()
    .references(() => playbooks.playbookId, {
      onUpdate: 'restrict',
      onDelete: 'cascade',
    }),
  playbookVersion: t.integer('playbook_version').notNull(),
  status: t
    .text('status', { enum: PlaybookRunStatusValues })
    .notNull()
    .default(PlaybookRunStatus.Pending),
  startedAt: t.integer('started_at'),
  completedAt: t.integer('completed_at'),
  ...activeRecord,
});

export type PlaybookRunAttributes = InferSelectModel<typeof playbookRuns>;

export const playbookRunLogs = t.pgTable(
  'playbook_run_logs',
  {
    playbookRunId: t
      .integer('playbook_run_id')
      .notNull()
      .references(() => playbookRuns.playbookRunId, {
        onUpdate: 'restrict',
        onDelete: 'cascade',
      }),
    sequence: t.integer('sequence').notNull(),
    contents: t.json('contents'),
  },
  (table) => ({
    pk: t.primaryKey({ columns: [table.playbookRunId, table.sequence] }),
  }),
);

export type PlaybookRunLogAttributes = InferSelectModel<typeof playbookRunLogs>;

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
