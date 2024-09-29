import { forwardRef, Module } from '@nestjs/common';
import { PlaybookRunService } from './playbook-run.service';
import { PlaybookModule } from '../playbook/playbook.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlaybookRun } from './playbook-run.model';
import { PlaybookRunResolver } from './playbook-run.resolver';

@Module({
  imports: [
    SequelizeModule.forFeature([PlaybookRun]),
    forwardRef(() => PlaybookModule),
  ],
  providers: [PlaybookRunService, PlaybookRunResolver],
  exports: [PlaybookRunService],
})
export class PlaybookRunModule {}
