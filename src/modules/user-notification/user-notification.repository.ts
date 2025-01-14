import { UserNotificaton } from './entity/user-notification.entity';

export abstract class UserNotificationRepository {
  abstract findUserById(id: number): Promise<UserNotificaton>;
}
