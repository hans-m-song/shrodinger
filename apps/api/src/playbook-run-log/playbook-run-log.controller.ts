import { Controller } from '@nestjs/common';
import { InjectLogger, Logger } from '../logger';
import { PlaybookRunLogService } from './playbook-run-log.service';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { defaultResponse, playbookRunLogContract } from '@shrodinger/contracts';
import { Errors, HttpError } from '../../../../libs/core/errors';
import { ServerInferResponses } from '@ts-rest/core';

@Controller()
export class PlaybookRunLogController {
  constructor(
    @InjectLogger(PlaybookRunLogController.name)
    private readonly logger: Logger,
    private readonly playbookRunLogService: PlaybookRunLogService,
  ) {}

  @TsRestHandler(playbookRunLogContract.listPlaybookRunLogs)
  async listPlaybookRunLogs() {
    return tsRestHandler(
      playbookRunLogContract.listPlaybookRunLogs,
      async ({ params, query }) => {
        const result = await this.playbookRunLogService.listPlaybookRunLogs({
          ...params,
          ...query,
        });
        if (!result.ok) {
          this.logger.error(result.error);

          const error = Errors.as(HttpError)(result.error);
          if (error) {
            return error.toResponse() as ServerInferResponses<
              typeof playbookRunLogContract.listPlaybookRunLogs
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
