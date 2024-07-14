import * as Joi from 'joi';
import { Options } from 'sequelize';

export default {
  meta: {
    sha: process.env.GIT_SHA,
  },
  http: {
    port: Joi.number().port().default(3000).validate(process.env.HTTP_PORT)
      .value,
  },
  cors: {
    allowedOrigins: Joi.array()
      .items(Joi.string().uri())
      .validate(process.env.CORS_ALLOWED_ORIGINS?.split(',')).value,
  },
  database: {
    host: Joi.string()
      .default('database.db')
      .validate(process.env.DATABASE_HOST).value,
    port: Joi.number().optional().validate(process.env.DATABASE_PORT).value,
    database: Joi.string().optional().validate(process.env.DATABASE_NAME).value,
    username: Joi.string().optional().validate(process.env.DATABASE_USER).value,
    password: Joi.string().optional().validate(process.env.DATABASE_PASS).value,
  } satisfies Options,
};
