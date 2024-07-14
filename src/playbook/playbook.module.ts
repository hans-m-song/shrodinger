import { Module } from '@nestjs/common';
import { PlaybookController } from './playbook.controller';
import { PlaybookResolver } from './playbook.resolver';
import { PlaybookService } from './playbook.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Playbook } from './playbook.model';

@Module({
  imports: [SequelizeModule.forFeature([Playbook])],
  controllers: [PlaybookController],
  providers: [PlaybookService, PlaybookResolver],
})
export class PlaybookModule {}
