import { PlaybookRunModel } from './playbook-run.model';
import { PlaybookModel } from './playbook.model';

export const DATABASE_MODELS_TOKEN = Symbol('@shrodinger/api.DatabaseModels');

export const databaseModels = {
  PlaybookModel,
  PlaybookRunModel,
};

export type DatabaseModels = typeof databaseModels;
