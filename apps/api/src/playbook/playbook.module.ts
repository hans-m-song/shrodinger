import { Module } from '@nestjs/common';
import { PlaybookResolver } from './playbook.resolver';
import { PlaybookService } from './playbook.service';
import { PlaybookModel } from '../database/models/playbook.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([PlaybookModel])],
  providers: [PlaybookService, PlaybookResolver],
  exports: [PlaybookService],
})
export class PlaybookModule {}
