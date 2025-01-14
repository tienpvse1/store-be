import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { PasswordHasher } from './interface';

// const BCRYPT = 'BCRYPT';
// export const InjectBcrypt = Inject(BCRYPT);

@Module({
  providers: [{ provide: PasswordHasher, useClass: BcryptHasher }],
  exports: [{ provide: PasswordHasher, useClass: BcryptHasher }],
})
export class HasherModule {}
