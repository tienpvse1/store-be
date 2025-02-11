import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
export const IsNotPublic = () => SetMetadata(IS_PUBLIC_KEY, false);
