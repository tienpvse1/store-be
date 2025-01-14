import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/common/roles';

export const HAS_ROLE_KEY = 'hasRole';

export const HasRole = (...roles: Role[]) => SetMetadata(HAS_ROLE_KEY, roles);
