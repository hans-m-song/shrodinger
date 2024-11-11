import { Injectable } from '@nestjs/common';
import {
  AnsibleLogEvent,
  AnsibleLogSchema,
  AnsiblePlaybookStats,
  AnsibleRunnerOkLogSchema,
  AnsibleRunnerLog,
  PlaybookRunLog,
} from '@shrodinger/contracts';
import { InjectLogger, Logger } from '../logger';
import { PlaybookRunLogErrors } from './playbook-run-log.errors';

export interface PlaybookRunLogTaskHost {
  hostname: string;
  duration: number;
  changed: boolean;
  data: Record<string, unknown>;
  deprecations?: string[];
  warnings?: string[];
  skip?: {
    reason: string;
    condition: string;
  };
}

export interface PlaybookRunLogTask {
  id: string;
  name: string;
  action: string;
  location: string;
  startedAt: number;
  hosts: Record<string, PlaybookRunLogTaskHost>;
}

export interface PlaybookRunResult {
  playbookName?: string;
  stats?: Record<string, AnsiblePlaybookStats>;
  tasks: PlaybookRunLogTask[];
}

@Injectable()
export class PlaybookRunLogMapper {
  constructor(
    @InjectLogger(PlaybookRunLogMapper.name)
    private readonly logger: Logger,
  ) {}

  public flatten(logs: PlaybookRunLog[]): PlaybookRunResult {
    const result: PlaybookRunResult = { tasks: [] };

    const tasks: Record<string, PlaybookRunLogTask> = {};

    for (const log of logs) {
      const parsed = AnsibleLogSchema.safeParse(log.contents);
      if (!parsed.success) {
        const error = new PlaybookRunLogErrors.Validation(
          parsed.error,
          log.contents,
        );

        this.logger.warn('could not parse ansible log line', error);
        continue;
      }

      switch (parsed.data._event) {
        case AnsibleLogEvent.PlaybookPlayStart:
          result.playbookName = parsed.data.play.name;
          continue;

        case AnsibleLogEvent.PlaybookStats:
          result.stats = parsed.data.stats;
          continue;

        case AnsibleLogEvent.PlaybookTaskStart:
          tasks[parsed.data.task.id] = {
            ...tasks[parsed.data.task.id],
            id: parsed.data.task.id,
            name: parsed.data.task.name,
            startedAt: parsed.data.task.duration.start,
          };
          continue;

        case AnsibleLogEvent.RunnerOk:
        case AnsibleLogEvent.RunnerSkipped:
          const host = this.flattenPlaybookRunRunnerLog(parsed.data);
          if (!host) {
            continue;
          }

          tasks[parsed.data.task.id] = {
            ...tasks[parsed.data.task.id],
            action: parsed.data.hosts[host.hostname].action,
            location: parsed.data.task.path,
            hosts: {
              ...tasks[parsed.data.task.id].hosts,
              [host.hostname]: host,
            },
          };
          continue;

        default:
          this.logger.warn('unknown event', { log });
          continue;
      }
    }

    result.tasks = Object.values(tasks).sort(
      (a, b) => a.startedAt - b.startedAt,
    );

    return result;
  }

  private flattenPlaybookRunRunnerLog(
    log: AnsibleRunnerLog,
  ): PlaybookRunLogTaskHost | null {
    const hostname = Object.keys(log.hosts)[0];
    const host = log.hosts[hostname];
    if (!hostname) {
      this.logger.warn('runner log did not contain any hosts', { log });
      return null;
    }

    AnsibleRunnerOkLogSchema;

    const {
      _ansible_no_log: _,
      _ansible_verbose_override: __,
      action: ___,
      skipped: ____,
      changed,
      deprecations,
      warnings,
      false_condition,
      skip_reason,
      ...data
    } = host as any;

    return {
      hostname,
      duration: log.task.duration.end - log.task.duration.start,
      changed,
      data,
      deprecations,
      warnings,
      skip: {
        condition: false_condition,
        reason: skip_reason,
      },
    };
  }
}
