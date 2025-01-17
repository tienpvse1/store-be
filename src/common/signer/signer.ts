import { User } from '@modules/user/entities/user.entity';

export abstract class TokenSigner {
  abstract signToken(payload: User, expiration: number | string): string;
  abstract verifyToken(token: string): User;
}
