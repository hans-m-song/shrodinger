import { z } from 'zod';

export enum AnsibleLogEvent {
  PlaybookPlayStart = 'v2_playbook_on_play_start',
  PlaybookTaskStart = 'v2_playbook_on_task_start',
  RunnerOk = 'v2_runner_on_ok',
  RunnerSkipped = 'v2_runner_on_skipped',
  PlaybookStats = 'v2_playbook_on_stats',
}

const ISOTimestampSchema = z
  .string()
  .transform((arg) => new Date(arg).valueOf());

export const AnsibleLogBaseSchema = z.object({
  _timestamp: z.string(),
  _event: z.string(),
});

export type AnsibleLogBase = z.infer<typeof AnsibleLogBaseSchema>;

export const AnsiblePlaybookPlayStartLogSchema = z.object({
  _timestamp: ISOTimestampSchema,
  _event: z.literal(AnsibleLogEvent.PlaybookPlayStart),
  play: z.object({
    duration: z.object({
      start: ISOTimestampSchema,
    }),
    id: z.string(),
    name: z.string(),
    path: z.string(),
  }),
});

export type AnsiblePlaybookPlayStartLog = z.infer<
  typeof AnsiblePlaybookPlayStartLogSchema
>;

export const AnsibleTaskSchema = z.object({
  duration: z.object({
    start: ISOTimestampSchema,
    end: ISOTimestampSchema,
  }),
  id: z.string(),
  name: z.string(),
  path: z.string(),
});

export type AnsibleTask = z.infer<typeof AnsibleTaskSchema>;

export const AnsiblePlaybookTaskStartLogSchema = z.object({
  _timestamp: ISOTimestampSchema,
  _event: z.literal(AnsibleLogEvent.PlaybookTaskStart),
  task: z.object({
    duration: z.object({
      start: ISOTimestampSchema,
    }),
    id: z.string(),
    name: z.string(),
    path: z.string(),
  }),
});

export type AnsiblePlaybookTaskStartLog = z.infer<
  typeof AnsiblePlaybookTaskStartLogSchema
>;

export const AnsibleRunnerTaskHostSchema = z.object({
  action: z.string(),
  changed: z.boolean(),
  deprecations: z.string().array().optional(),
  warnings: z.string().array().optional(),
});

export const AnsibleRunnerOkLogSchema = z.object({
  _timestamp: ISOTimestampSchema,
  _event: z.literal(AnsibleLogEvent.RunnerOk),
  task: AnsibleTaskSchema,
  hosts: z.record(z.string(), AnsibleRunnerTaskHostSchema),
});

export type AnsibleRunnerOkLog = z.infer<typeof AnsibleRunnerOkLogSchema>;

export const AnsibleRunnerSkippedLogSchema = z.object({
  _timestamp: ISOTimestampSchema,
  _event: z.literal(AnsibleLogEvent.RunnerSkipped),
  task: AnsibleTaskSchema,
  hosts: z.record(
    z.string(),
    AnsibleRunnerTaskHostSchema.extend({
      false_condition: z.string(),
      skip_reason: z.string(),
      skipped: z.boolean(),
    }),
  ),
});

export type AnsibleRunnerSkippedLog = z.infer<
  typeof AnsibleRunnerSkippedLogSchema
>;

export type AnsibleRunnerLog = AnsibleRunnerOkLog | AnsibleRunnerSkippedLog;

export const AnsiblePlaybookStatsSchema = z.object({
  changed: z.number(),
  failures: z.number(),
  ignored: z.number(),
  ok: z.number(),
  rescued: z.number(),
  skipped: z.number(),
  unreachable: z.number(),
});

export type AnsiblePlaybookStats = z.infer<typeof AnsiblePlaybookStatsSchema>;

export const AnsiblePlaybookStatsLogSchema = z.object({
  _timestamp: ISOTimestampSchema,
  _event: z.literal(AnsibleLogEvent.PlaybookStats),
  stats: z.record(z.string(), AnsiblePlaybookStatsSchema),
});

export const AnsibleLogSchema = z.discriminatedUnion('_event', [
  AnsiblePlaybookPlayStartLogSchema,
  AnsiblePlaybookTaskStartLogSchema,
  AnsibleRunnerOkLogSchema,
  AnsibleRunnerSkippedLogSchema,
  AnsiblePlaybookStatsLogSchema,
]);

export type AnsibleLog = z.infer<typeof AnsibleLogSchema>;
