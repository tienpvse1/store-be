import { User } from '@modules/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  (key: keyof User, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!request.user) return null;
    return key ? request.user[key] : request.user;
  },
);

export function UserId() {
  return UserInfo('id');
}
