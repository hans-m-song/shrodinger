import {
  AnsibleLogEvent,
  AnsiblePlaybookStats,
  PlaybookRunLog,
} from '@shrodinger/contracts';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Chip, { ChipProps } from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { toDuration } from '../lib/string';
import Divider from '@mui/material/Divider';
import FastForwardIcon from '@mui/icons-material/FastForward';
import CheckIcon from '@mui/icons-material/Check';
import Alert from '@mui/material/Alert';

const statColorMapping: Record<keyof AnsiblePlaybookStats, ChipProps['color']> =
  {
    ok: 'success',
    changed: 'info',
    skipped: 'info',
    ignored: 'info',
    rescued: 'warning',
    failures: 'error',
    unreachable: 'error',
  };

type Task = {
  id: string;
  name: string;
  path: string;
  action?: string;
  sequence: number;
  timestamp: number;
  hosts: Record<string, Host>;
};

type Host = {
  hostname: string;
  duration: number;
  warnings?: string[];
  skipped?: boolean;
  changed?: boolean;
};

const buildTree = (logs: PlaybookRunLog[]) => {
  const meta = {
    name: '',
    path: '',
    stats: {} as Record<string, AnsiblePlaybookStats>,
    tasks: {} as Record<string, Task>,
  };

  for (const log of logs) {
    switch (log.contents._event) {
      case AnsibleLogEvent.PlaybookPlayStart:
        meta.name = log.contents.play.name;
        meta.path = log.contents.play.path;
        continue;

      case AnsibleLogEvent.PlaybookStats:
        meta.stats = { ...meta.stats, ...log.contents.stats };
        continue;

      case AnsibleLogEvent.PlaybookTaskStart:
        meta.tasks[log.contents.task.id] = {
          ...meta.tasks[log.contents.task.id],
          id: log.contents.task.id,
          name: log.contents.task.name,
          path: log.contents.task.path,
          sequence: log.sequence,
          timestamp: log.contents._timestamp,
        };
        continue;

      case AnsibleLogEvent.RunnerOk:
      case AnsibleLogEvent.RunnerSkipped:
        let action: string | undefined;
        const hosts: Record<string, Host> = {};
        for (const [hostname, host] of Object.entries(log.contents.hosts)) {
          action = action || host.action;
          hosts[hostname] = {
            hostname,
            duration:
              log.contents.task.duration.end - log.contents.task.duration.start,
            warnings: host.warnings,
            skipped:
              'skipped' in host && typeof host.skipped === 'boolean'
                ? host.skipped
                : undefined,
            changed: host.changed,
          };
        }

        meta.tasks[log.contents.task.id] = {
          action,
          ...meta.tasks[log.contents.task.id],
          hosts: {
            ...meta.tasks[log.contents.task.id].hosts,
            ...hosts,
          },
        };
        continue;

      default:
        console.warn('unhandled log event', log.contents);
        continue;
    }
  }

  const sortedTasks = Object.values(meta.tasks).toSorted(
    (a, b) => a.timestamp - b.timestamp,
  );

  return { ...meta, tasks: sortedTasks };
};

export interface PlaybookRunLogDisplayProps {
  data: PlaybookRunLog[];
}

export const PlaybookRunLogDisplay = (props: PlaybookRunLogDisplayProps) => {
  const { name, path, stats, tasks } = useMemo(
    () => buildTree(props.data),
    [props.data],
  );

  console.log({ tasks });

  return (
    <Stack>
      <Paper sx={{ p: 2 }}>
        <Typography>
          {name} - {path}
        </Typography>
        <List>
          {Object.entries(stats).map(([hostname, stat]) => (
            <ListItem key={hostname}>
              <Stack direction="row">
                <Typography>{hostname}</Typography>
                {Object.entries(statColorMapping).map(([key, color]) => {
                  const value = stat[key as keyof AnsiblePlaybookStats];
                  return value > 0 ? (
                    <Chip
                      key={key}
                      avatar={
                        <Avatar sx={{ bgcolor: 'white' }}>{value}</Avatar>
                      }
                      label={key}
                      color={color}
                    />
                  ) : null;
                })}
              </Stack>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Stack>
        {tasks.map((task) => (
          <Paper key={task.id} sx={{ p: 2 }}>
            <Stack>
              <Stack direction="row" alignItems="center">
                <Typography>
                  {new Date(task.timestamp).toLocaleTimeString()}
                </Typography>
                <Divider flexItem orientation="vertical" />
                <Typography sx={{ flexGrow: 1 }}>{task.name}</Typography>
                {task.action && <Chip label={task.action} />}
              </Stack>
              <Typography>{task.path}</Typography>
              {Object.values(task.hosts).map((host) => (
                <Stack key={host.hostname}>
                  <Stack
                    key={host.hostname}
                    direction="row"
                    alignItems="center"
                  >
                    {host.skipped ? (
                      <FastForwardIcon color="info" />
                    ) : (
                      <CheckIcon color="success" />
                    )}
                    <Typography>{host.hostname}</Typography>
                    <Chip label={toDuration(host.duration)} />
                  </Stack>
                  {host.warnings?.length &&
                    host.warnings.map((warning, i) => (
                      <Alert severity="warning" key={i}>
                        {warning}
                      </Alert>
                    ))}
                </Stack>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
};
