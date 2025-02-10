import { NotificationEvent } from '../event';
import { Notifier, Sendable } from './interface';

/**
 * using the decorator pattern + linked list structure to compose multiple notifiers
 */
export class NotifierComposer extends Sendable {
  private core: NotifierComposer;
  private current: Notifier;

  constructor(initialNotifier: Notifier) {
    super();
    this.current = initialNotifier;
  }

  add(newNotifier: Notifier) {
    this.core = this;
    this.current = newNotifier;
  }

  async send(
    event: NotificationEvent,
    userId: number,
    content: string,
  ): Promise<boolean> {
    if (this.current) {
      await this.current.send(event, userId, content);
    }
    if (this.core) {
      return this.core.send(event, userId, content);
    }
    return;
  }
}
