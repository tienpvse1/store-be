import { Injectable } from '@nestjs/common';
import { Generator } from '@common/code-generator/generator';

@Injectable()
export class DatetimeCodeGenerator extends Generator {
  generateCode(prefix?: string): string {
    return `${prefix || ''}-${new Date().getTime()}`;
  }
}
