import { registerEnumType } from '@nestjs/graphql';

export enum PlaybookRunStatus {
  Pending = 'PENDING',
  Running = 'RUNNING',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
}

registerEnumType(PlaybookRunStatus, { name: 'PlaybookRunStatus' });
