import { forwardRef, Module } from '@nestjs/common';
import { PlaybookResolver } from './playbook.resolver';
import { PlaybookService } from './playbook.service';
import { PlaybookRunModule } from '../playbook-run/playbook-run.module';
import { Playbook } from './playbook.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([Playbook]),
    forwardRef(() => PlaybookRunModule),
  ],
  providers: [PlaybookService, PlaybookResolver],
  exports: [PlaybookService],
})
export class PlaybookModule {}
