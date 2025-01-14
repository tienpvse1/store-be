import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PasswordHasher } from './interface';

@Injectable()
export class BcryptHasher extends PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async comparePassword(
    providedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return compare(providedPassword, storedPassword);
  }
}
