import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { UserNotificationRepository } from 'src/modules/user-notification/user-notification.repository';
import { User } from 'src/modules/user/entities/user.entity';
import { NotificationEvent } from '../event';
import { Notifier } from './interface';

export class EmailNotifier extends Notifier {
  private transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor(
    private userService: UserNotificationRepository,
    private config: ConfigService,
  ) {
    super();

    this.transporter = createTransport({
      service: 'gmail',
      auth: this.config.get('notification.email.auth'),
    });
  }

  parseContent(user: User, content: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async send(
    event: NotificationEvent,
    receiverId: number,
    content: string,
  ): Promise<boolean> {
    const user = await this.userService.findUserById(receiverId);

    await this.transporter.sendMail({
      from: 'Tien Phan<emtentien2000@gmai.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: content, // plain text body
    });

    return true;
  }
}
