import 'dotenv/config';
import { CamelCasePlugin } from 'kysely';
import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg';

const poolConfig = {
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  max: 10,
};

export default defineConfig({
  dialect: 'pg',
  dialectConfig: {
    pool: new Pool(poolConfig),
  },
  plugins: [new CamelCasePlugin()],
});
