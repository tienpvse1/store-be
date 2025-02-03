import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { User } from '@modules/user/entities/user.entity';
import { TokenSigner } from './signer';

@Injectable()
export class Hs256TokenSigner extends TokenSigner {
  secret: string;

  constructor(private config: ConfigService) {
    super();
    const secret = this.config.get('jwt.secret');
    if (!secret) {
      throw new Error('JWT secret not found');
    }
    this.secret = secret;
  }

  verifyToken(token: string): User {
    return verify(token, this.secret, { ignoreExpiration: false }) as User;
  }

  signToken(payload: User, expiration: string | number): string {
    const token = sign(payload, this.secret, {
      issuer: 'x-nest-backend',
      algorithm: 'HS256',
      expiresIn: expiration,
      subject: payload.id.toString(),
    });
    return token;
  }
}
