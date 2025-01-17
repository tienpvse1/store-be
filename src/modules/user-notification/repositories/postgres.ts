import { InjectKysely, KyselyInstance } from '@common/db';
import { UserNotificaton } from '../entity/user-notification.entity';
import { UserNotificationRepository } from '../user-notification.repository';

export class UserNotificationPostgresRepository extends UserNotificationRepository {
  constructor(@InjectKysely private kysely: KyselyInstance) {
    super();
  }

  findUserById(id: number): Promise<UserNotificaton> {
    return this.kysely
      .selectFrom('user')
      .leftJoin('userRole', 'userRole.userId', 'user.id')
      .groupBy('user.id')
      .select((eb) => [
        'user.id',
        'user.name',
        'user.email',
        eb.fn.jsonAgg(eb.ref('roleName')).as('roles'),
      ])
      .where('id', '=', id)
      .executeTakeFirst();
  }
}
