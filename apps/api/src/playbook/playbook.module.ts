import { forwardRef, Module } from '@nestjs/common';
import { PlaybookResolver } from './playbook.resolver';
import { PlaybookService } from './playbook.service';
import { DatabaseModule } from '../database';
import { PlaybookRunModule } from '../playbook-run/playbook-run.module';
import { PlaybookController } from './playbook.controller';
import { ListPlaybooksQueryHandler } from './handlers/list-playbooks.handler';
import { GetPlaybookQueryHandler } from './handlers/get-playbook.handler';
import { UpdatePlaybookCommandHandler } from './handlers/update-playbook.handler';
import { CreatePlaybookCommandHandler } from './handlers/create-playbook.handler';
import { DeletePlaybookCommandHandler } from './handlers/delete-playbook.handler';

@Module({
  imports: [DatabaseModule.register(), forwardRef(() => PlaybookRunModule)],
  controllers: [PlaybookController],
  providers: [
    PlaybookService,
    PlaybookResolver,
    ListPlaybooksQueryHandler,
    CreatePlaybookCommandHandler,
    GetPlaybookQueryHandler,
    UpdatePlaybookCommandHandler,
    DeletePlaybookCommandHandler,
  ],
  exports: [PlaybookService],
})
export class PlaybookModule {}
