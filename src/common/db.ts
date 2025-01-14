import { DynamicModule, Inject, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { DB } from 'kysely-codegen';
import * as pg from 'pg';
import { parse } from 'postgres-array';

export const KYSELY_INSTANCE = 'KYSELY_INSTANCE';
export const InjectKysely = Inject(KYSELY_INSTANCE);
export type KyselyInstance = Kysely<DB>;

// 16440
pg.types.setTypeParser(16440, 'text', parse);

@Module({})
export class DBModule {
  static forRoot(): DynamicModule {
    return {
      module: DBModule,
      providers: [
        {
          provide: KYSELY_INSTANCE,
          inject: [ConfigService],
          useFactory(config: ConfigService) {
            const connectionPool = new pg.Pool({
              database: config.get('database.name'),
              user: config.get('database.user'),
              password: config.get('database.password'),
              host: config.get('database.host'),
              port: config.get('database.port'),
              max: 10,
            });
            const dialect = new PostgresDialect({
              pool: connectionPool,
            });
            const db = new Kysely<DB>({
              dialect,
              plugins: [new CamelCasePlugin()],
            });

            return db;
          },
        },
      ],
      exports: [KYSELY_INSTANCE],
      global: true,
    };
  }
}
