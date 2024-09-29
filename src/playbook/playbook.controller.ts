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

  @Get(':playbookId')
  async get(@Param('playbookId') playbookId: string): Promise<Playbook> {
    return this.playbookService.get(playbookId);
  }

  @Delete(':playbookId')
  async remove(@Param('playbookId') playbookId: string) {
    await this.playbookService.remove(playbookId);
  }

  @Put(':playbookId')
  async update(
    @Param('playbookId') playbookId: string,
    @Body() body: IPlaybook,
  ): Promise<Playbook> {
    return this.playbookService.update({ ...body, playbookId });
  }

  @Post()
  async create(@Body() body: IPlaybook): Promise<Playbook> {
    return this.playbookService.create(body);
  }
}
