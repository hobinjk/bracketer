import { drizzle } from 'drizzle-orm/libsql';
import config from '../../../drizzle.config.ts';
import * as schema from '../schema.ts';

export const db = drizzle({
  connection: {
    url: config.dbCredentials.url,
  },
  schema,
});
