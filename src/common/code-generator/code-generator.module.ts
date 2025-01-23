import { DynamicModule, Module } from '@nestjs/common';
import { Generator } from './generator';
import { DatetimeCodeGenerator } from './strategies/default';

@Module({})
export class CodeGeneratorModule {
  static forRoot(): DynamicModule {
    const providers = [
      {
        provide: Generator,
        useClass: DatetimeCodeGenerator,
      },
    ];
    return {
      module: CodeGeneratorModule,
      providers: providers,
      exports: providers,
      global: true,
    };
  }
}
