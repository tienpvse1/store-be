import { Injectable } from '@nestjs/common';
import { NotificationEvent } from './event';
import { Sendable } from './notifier/interface';

@Injectable()
export class NotificationService {
  constructor(private sender: Sendable) {}

  send(event: NotificationEvent, receiverId: number, content: string) {
    return this.sender.send(event, receiverId, content);
  }
}
