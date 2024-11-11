import { Injectable } from '@nestjs/common';
import {
  ListPlaybookRunLogsHandler,
  ListPlaybookRunLogsQuery,
} from './handlers/list-playbook-run-logs.handler';
import {
  CreatePlaybookRunLogCommand,
  CreatePlaybookRunLogHandler,
} from './handlers/create-playbook-run-log.handler';

@Injectable()
export class PlaybookRunLogService {
  constructor(
    private readonly listPlaybookRunLogsHandler: ListPlaybookRunLogsHandler,
    private readonly createPlaybookRunLogHandler: CreatePlaybookRunLogHandler,
  ) {}

  async listPlaybookRunLogs(
    args: ConstructorParameters<typeof ListPlaybookRunLogsQuery>[0],
  ) {
    const query = new ListPlaybookRunLogsQuery(args);
    return this.listPlaybookRunLogsHandler.execute(query);
  }

  async createPlaybookRunLog(
    args: ConstructorParameters<typeof CreatePlaybookRunLogCommand>[0],
  ) {
    const command = new CreatePlaybookRunLogCommand(args);
    return this.createPlaybookRunLogHandler.execute(command);
  }
}
