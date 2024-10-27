import { Injectable } from '@nestjs/common';
import {
  ListPlaybooksQueryHandler,
  ListPlaybooksQuery,
} from './handlers/list-playbooks.handler';
import {
  DeletePlaybookCommand,
  DeletePlaybookCommandHandler,
} from './handlers/delete-playbook';
import {
  CreatePlaybookCommand,
  CreatePlaybookCommandHandler,
} from './handlers/create-playbook.handler';
import {
  UpdatePlaybookCommand,
  UpdatePlaybookCommandHandler,
} from './handlers/update-playbook.handler';
import {
  ReadPlaybookQueryHandler,
  ReadPlaybookQuery,
} from './handlers/read-playbook.handler';

@Injectable()
export class PlaybookService {
  constructor(
    private readonly listPlaybooksRunsQuery: ListPlaybooksQueryHandler,
    private readonly createPlaybookCommand: CreatePlaybookCommandHandler,
    private readonly readPlaybookQuery: ReadPlaybookQueryHandler,
    private readonly updatePlaybookCommand: UpdatePlaybookCommandHandler,
    private readonly deletePlaybookCommand: DeletePlaybookCommandHandler,
  ) {}

  async listPlaybooks(
    args: ConstructorParameters<typeof ListPlaybooksQuery>[0],
  ) {
    const query = new ListPlaybooksQuery(args);
    return this.listPlaybooksRunsQuery.execute(query);
  }

  async createPlaybook(
    args: ConstructorParameters<typeof CreatePlaybookCommand>[0],
  ) {
    const command = new CreatePlaybookCommand(args);
    return this.createPlaybookCommand.execute(command);
  }

  async readPlaybook(args: ConstructorParameters<typeof ReadPlaybookQuery>[0]) {
    const query = new ReadPlaybookQuery(args);
    return this.readPlaybookQuery.execute(query);
  }

  async updatePlaybook(
    args: ConstructorParameters<typeof UpdatePlaybookCommand>[0],
  ) {
    const command = new UpdatePlaybookCommand(args);
    return this.updatePlaybookCommand.execute(command);
  }

  async deletePlaybook(
    args: ConstructorParameters<typeof DeletePlaybookCommand>[0],
  ) {
    const command = new DeletePlaybookCommand(args);
    return this.deletePlaybookCommand.execute(command);
  }
}
