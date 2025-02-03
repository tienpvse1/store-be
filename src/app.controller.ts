import { IsPublic } from '@decorators/is-public.decorator';
import { Controller, Get, Req } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  @IsPublic()
  @ApiExcludeEndpoint()
  redirectToAPIDoc(@Req() req: Request) {
    return req.res.redirect('/api');
  }
}
