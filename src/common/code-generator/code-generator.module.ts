import { DynamicModule, Module } from '@nestjs/common';
import { Generator } from './generator';
import { DatetimeCodeGenerator } from './strategies/default';
import { PassCodeGenerator } from './strategies/pass-code-generator';

export enum CodeGenerateStrategy {
  Datetime = 'Datetime',
  PassCode = 'PassCode',
}
@Module({})
export class CodeGeneratorModule {
  static forFeature(strategy?: CodeGenerateStrategy): DynamicModule {
    const providers = [
      {
        provide: Generator,
        useClass:
          strategy === CodeGenerateStrategy.PassCode
            ? PassCodeGenerator
            : DatetimeCodeGenerator,
      },
    ];
    return {
      module: CodeGeneratorModule,
      providers: providers,
      exports: providers,
    };
  }
}
