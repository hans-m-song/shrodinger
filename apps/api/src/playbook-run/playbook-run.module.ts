import { forwardRef, Module } from '@nestjs/common';
import { PlaybookRunService } from './playbook-run.service';
import { PlaybookModule } from '../playbook/playbook.module';
import { PlaybookRunResolver } from './playbook-run.resolver';
import { DatabaseModule } from '../database';
import { CreatePlaybookRunHandler } from './handlers/create-playbook-run.handler';
import { DeletePlaybookRunHandler } from './handlers/delete-playbook-run';
import { ListPlaybookRunsHandler } from './handlers/list-playbook-runs.handler';
import { ReadPlaybookRunHandler } from './handlers/read-playbook-run.handler';
import { UpdatePlaybookRunHandler } from './handlers/update-playbook-run.handler';
import { PlaybookRunController } from './playbook-run.controller';
import { PlaybookRunLogModule } from '../playbook-run-log/playbook-run-log.module';

@Module({
  imports: [
    DatabaseModule.register(),
    forwardRef(() => PlaybookModule),
    forwardRef(() => PlaybookRunLogModule),
  ],
  controllers: [PlaybookRunController],
  providers: [
    PlaybookRunService,
    PlaybookRunResolver,
    ListPlaybookRunsHandler,
    CreatePlaybookRunHandler,
    ReadPlaybookRunHandler,
    UpdatePlaybookRunHandler,
    DeletePlaybookRunHandler,
  ],
  exports: [PlaybookRunService],
})
export class PlaybookRunModule {}
