import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { PlaybookRunModule } from '../playbook-run/playbook-run.module';
import { PlaybookRunLogController } from './playbook-run-log.controller';
import { PlaybookRunLogService } from './playbook-run-log.service';
import { PlaybookRunLogResolver } from './playbook-run-log.resolver';
import { ListPlaybookRunLogsHandler } from './handlers/list-playbook-run-logs.handler';
import { CreatePlaybookRunLogHandler } from './handlers/create-playbook-run-log.handler';

@Module({
  imports: [DatabaseModule.register(), forwardRef(() => PlaybookRunModule)],
  controllers: [PlaybookRunLogController],
  providers: [
    PlaybookRunLogResolver,
    PlaybookRunLogService,
    ListPlaybookRunLogsHandler,
    CreatePlaybookRunLogHandler,
  ],
  exports: [PlaybookRunLogService],
})
export class PlaybookRunLogModule {}
