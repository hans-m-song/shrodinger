import { Controller, Logger } from '@nestjs/common';
import { defaultResponse, playbookRunContract } from '@shrodinger/contracts';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { PlaybookRunService } from './playbook-run.service';
import { Errors, HttpError } from '@shrodinger/core/errors';
import { ServerInferResponses } from '@ts-rest/core';
import { InjectLogger } from '../logger';

@Controller()
export class PlaybookRunController {
  constructor(
    @InjectLogger(PlaybookRunController.name)
    private readonly logger: Logger,
    private readonly playbookRunService: PlaybookRunService,
  ) {}

  @TsRestHandler(playbookRunContract.listPlaybookRuns)
  async listPlaybookRuns() {
    return tsRestHandler(
      playbookRunContract.listPlaybookRuns,
      async ({ query }) => {
        const result = await this.playbookRunService.listPlaybookRuns(query);
        if (!result.ok) {
          this.logger.error(result.error);

          const error = Errors.as(HttpError)(result.error);
          if (error) {
            return error.toResponse() as ServerInferResponses<
              typeof playbookRunContract.listPlaybookRuns
            >;
          }

          return defaultResponse[500];
        }

        return {
          status: 200,
          body: { data: result.data },
        };
      },
    );
  }

  @TsRestHandler(playbookRunContract.createPlaybookRun)
  async createPlaybookRun() {
    return tsRestHandler(
      playbookRunContract.createPlaybookRun,
      async ({ body }) => {
        const result = await this.playbookRunService.createPlaybookRun(body);
        if (!result.ok) {
          this.logger.error(result.error);

          const error = Errors.as(HttpError)(result.error);
          if (error) {
            return error.toResponse() as ServerInferResponses<
              typeof playbookRunContract.createPlaybookRun
            >;
          }

          return defaultResponse[500];
        }

        return {
          status: 200,
          body: { data: result.data },
        };
      },
    );
  }

  @TsRestHandler(playbookRunContract.updatePlaybookRun)
  async updatePlaybookRun() {
    return tsRestHandler(
      playbookRunContract.updatePlaybookRun,
      async ({ body }) => {
        const result = await this.playbookRunService.updatePlaybookRun(body);
        if (!result.ok) {
          this.logger.error(result.error);

          const error = Errors.as(HttpError)(result.error);
          if (error) {
            return error.toResponse() as ServerInferResponses<
              typeof playbookRunContract.updatePlaybookRun
            >;
          }

          return defaultResponse[500];
        }

        return {
          status: 200,
          body: { data: result.data },
        };
      },
    );
  }

  @TsRestHandler(playbookRunContract.getPlaybookRun)
  async getPlaybookRun() {
    return tsRestHandler(
      playbookRunContract.getPlaybookRun,
      async ({ params }) => {
        const result = await this.playbookRunService.readPlaybookRun(params);
        if (!result.ok) {
          this.logger.error(result.error);

          const error = Errors.as(HttpError)(result.error);
          if (error) {
            return error.toResponse() as ServerInferResponses<
              typeof playbookRunContract.getPlaybookRun
            >;
          }

          return defaultResponse[500];
        }

        return {
          status: 200,
          body: { data: result.data },
        };
      },
    );
  }
}