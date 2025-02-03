import { InjectKysely, KyselyInstance } from '@common/db';
import { Injectable } from '@nestjs/common';
import { Otp } from '../entities/otp.entity';
import { OtpRepository } from '../otp.repository';

@Injectable()
export class PostgresOtpRepository extends OtpRepository {
  constructor(@InjectKysely private readonly instance: KyselyInstance) {
    super();
  }

  async findActiveOtpByUserEmail(email: string) {
    const result = await this.instance
      .selectFrom('otp')
      .leftJoin('user', 'otp.userId', 'user.id')
      .select(['otp.id', 'otp.isActive', 'otp.userId', 'otp.createdAt'])
      .where('user.email', '=', email)
      .executeTakeFirst();
    return result;
  }

  setOtpForUser(userId: number, passcode: string): Promise<Otp> {
    return this.instance
      .insertInto('otp')
      .values({
        id: passcode,
        userId,
        createdAt: new Date(),
        isActive: true,
      })
      .returning(['id'])
      .executeTakeFirst();
  }

  async deactivateOtherPasscode(userId: number): Promise<void> {
    await this.instance
      .updateTable('otp')
      .set('isActive', false)
      .where('userId', '=', userId)
      .execute();
  }
}
