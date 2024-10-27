import { Injectable } from '@nestjs/common';
import {
  ListPlaybookRunsHandler,
  ListPlaybookRunsQuery,
} from './handlers/list-playbook-runs.handler';
import {
  DeletePlaybookRunCommand,
  DeletePlaybookRunHandler,
} from './handlers/delete-playbook-run';
import {
  CreatePlaybookRunCommand,
  CreatePlaybookRunHandler,
} from './handlers/create-playbook-run.handler';
import {
  UpdatePlaybookRunCommand,
  UpdatePlaybookRunHandler,
} from './handlers/update-playbook-run.handler';
import {
  ReadPlaybookRunHandler,
  ReadPlaybookRunQuery,
} from './handlers/read-playbook-run.handler';

@Injectable()
export class PlaybookRunService {
  constructor(
    private readonly listPlaybookRunsRunsHandler: ListPlaybookRunsHandler,
    private readonly createPlaybookRunHandler: CreatePlaybookRunHandler,
    private readonly readPlaybookRunHandler: ReadPlaybookRunHandler,
    private readonly updatePlaybookRunHandler: UpdatePlaybookRunHandler,
    private readonly deletePlaybookRunHandler: DeletePlaybookRunHandler,
  ) {}

  async listPlaybookRuns(
    args: ConstructorParameters<typeof ListPlaybookRunsQuery>[0],
  ) {
    const query = new ListPlaybookRunsQuery(args);
    return this.listPlaybookRunsRunsHandler.execute(query);
  }

  async createPlaybookRun(
    args: ConstructorParameters<typeof CreatePlaybookRunCommand>[0],
  ) {
    const command = new CreatePlaybookRunCommand(args);
    return this.createPlaybookRunHandler.execute(command);
  }

  async readPlaybookRun(
    args: ConstructorParameters<typeof ReadPlaybookRunQuery>[0],
  ) {
    const query = new ReadPlaybookRunQuery(args);
    return this.readPlaybookRunHandler.execute(query);
  }

  async updatePlaybookRun(
    args: ConstructorParameters<typeof UpdatePlaybookRunCommand>[0],
  ) {
    const command = new UpdatePlaybookRunCommand(args);
    return this.updatePlaybookRunHandler.execute(command);
  }

  async deletePlaybookRun(
    args: ConstructorParameters<typeof DeletePlaybookRunCommand>[0],
  ) {
    const command = new DeletePlaybookRunCommand(args);
    return this.deletePlaybookRunHandler.execute(command);
  }
}
