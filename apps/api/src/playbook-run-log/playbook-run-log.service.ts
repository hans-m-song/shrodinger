import { Injectable } from '@nestjs/common';
import {
  ListPlaybookRunLogsHandler,
  ListPlaybookRunLogsQuery,
} from './handlers/list-playbook-run-logs.handler';

@Injectable()
export class PlaybookRunLogService {
  constructor(
    private readonly listPlaybookRunLogsHandler: ListPlaybookRunLogsHandler,
  ) {}

  async listPlaybookRunLogs(
    args: ConstructorParameters<typeof ListPlaybookRunLogsQuery>[0],
  ) {
    const query = new ListPlaybookRunLogsQuery(args);
    return this.listPlaybookRunLogsHandler.execute(query);
  }
}
