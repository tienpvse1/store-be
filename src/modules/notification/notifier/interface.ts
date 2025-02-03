import { User } from '@modules/user/entities/user.entity';
import { NotificationEvent } from '../event';

export abstract class Sendable {
  abstract send(
    event: NotificationEvent,
    receiverId: number,
    content: string,
  ): Promise<boolean>;
}

export abstract class Notifier extends Sendable {
  abstract parseContent(user: User, content: string): Promise<string>;
}
