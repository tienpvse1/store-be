import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectKysely, KyselyInstance } from '@common/db';
import { sql } from 'kysely';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(@InjectKysely private instance: KyselyInstance) {}
  onApplicationBootstrap() {
    sql<string>`SELECT 1 + 1;`.execute(this.instance);
  }
}
