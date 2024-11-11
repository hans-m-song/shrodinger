import { Controller, Logger } from '@nestjs/common';
import { defaultResponse, playbookContract } from '@shrodinger/contracts';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { PlaybookService } from './playbook.service';
import { Errors, HttpError } from '@shrodinger/core/errors';
import { ServerInferResponses } from '@ts-rest/core';
import { InjectLogger } from '../logger';

@Controller()
export class PlaybookController {
  constructor(
    @InjectLogger(PlaybookController.name)
    private readonly logger: Logger,
    private readonly playbookService: PlaybookService,
  ) {}

  @TsRestHandler(playbookContract.listPlaybooks)
  async listPlaybooks() {
    return tsRestHandler(playbookContract.listPlaybooks, async ({ query }) => {
      const result = await this.playbookService.listPlaybooks(query);
      if (!result.ok) {
        this.logger.error(result.error);

        const error = Errors.as(HttpError)(result.error);
        if (error) {
          return error.toResponse() as ServerInferResponses<
            typeof playbookContract.listPlaybooks
          >;
        }

        return defaultResponse[500];
      }

      return {
        status: 200,
        body: { data: result.data },
      };
    });
  }

  @TsRestHandler(playbookContract.updatePlaybook)
  async updatePlaybook() {
    return tsRestHandler(
      playbookContract.updatePlaybook,
      async ({ params, body }) => {
        const result = await this.playbookService.updatePlaybook({
          playbookId: params.playbookId,
          ...body,
        });
        if (!result.ok) {
          this.logger.error(result.error);

          const error = Errors.as(HttpError)(result.error);
          if (error) {
            return error.toResponse() as ServerInferResponses<
              typeof playbookContract.updatePlaybook
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

  @TsRestHandler(playbookContract.getPlaybook)
  async getPlaybook() {
    return tsRestHandler(playbookContract.getPlaybook, async ({ params }) => {
      const result = await this.playbookService.getPlaybook(params);
      if (!result.ok) {
        this.logger.error(result.error);

        const error = Errors.as(HttpError)(result.error);
        if (error) {
          return error.toResponse() as ServerInferResponses<
            typeof playbookContract.getPlaybook
          >;
        }

        return defaultResponse[500];
      }

      return {
        status: 200,
        body: { data: result.data },
      };
    });
  }
}
