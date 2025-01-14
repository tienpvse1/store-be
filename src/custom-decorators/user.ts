import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';

export const UserInfo = createParamDecorator(
  (key: keyof User, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) return null;
    return key ? request.user[key] : request;
  },
);
