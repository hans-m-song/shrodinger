import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PlaybookService } from './playbook.service';
import { IPlaybook, Playbook } from './playbook.model';

@Controller('playbooks')
export class PlaybookController {
  constructor(private playbookService: PlaybookService) {}

  @Get()
  async list(
    @Query('skip') skip: number,
    @Query('take') take: number,
  ): Promise<Playbook[]> {
    return this.playbookService.list({ skip, take });
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<Playbook> {
    return this.playbookService.get(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.playbookService.remove(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: IPlaybook,
  ): Promise<Playbook> {
    return this.playbookService.update({ ...body, id });
  }

  @Post()
  async create(@Body() body: IPlaybook): Promise<Playbook> {
    return this.playbookService.create(body);
  }
}
