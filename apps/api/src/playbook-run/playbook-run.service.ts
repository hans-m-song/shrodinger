import { Injectable } from '@nestjs/common';
import {
  ListPlaybookRunsHandler,
  ListPlaybookRunsQuery,
} from './handlers/list-playbook-runs.handler';
import {
  DeletePlaybookRunCommand,
  DeletePlaybookRunHandler,
} from './handlers/delete-playbook-run.handler';
import {
  CreatePlaybookRunCommand,
  CreatePlaybookRunHandler,
} from './handlers/create-playbook-run.handler';
import {
  UpdatePlaybookRunCommand,
  UpdatePlaybookRunHandler,
} from './handlers/update-playbook-run.handler';
import {
  GetPlaybookRunHandler,
  GetPlaybookRunQuery,
} from './handlers/get-playbook-run.handler';

@Injectable()
export class PlaybookRunService {
  constructor(
    private readonly listPlaybookRunsRunsHandler: ListPlaybookRunsHandler,
    private readonly createPlaybookRunHandler: CreatePlaybookRunHandler,
    private readonly getPlaybookRunHandler: GetPlaybookRunHandler,
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

  async getPlaybookRun(
    args: ConstructorParameters<typeof GetPlaybookRunQuery>[0],
  ) {
    const query = new GetPlaybookRunQuery(args);
    return this.getPlaybookRunHandler.execute(query);
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
