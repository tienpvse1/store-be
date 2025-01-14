import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Hs256TokenSigner } from './hs256.singer';
import { TokenSigner } from './signer';

@Module({})
export class TokenSignerModule {
  static forRoot(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: TokenSigner,
        inject: [ConfigService],
        useFactory(config: ConfigService) {
          return new Hs256TokenSigner(config);
        },
      },
    ];
    return {
      module: TokenSignerModule,
      providers,
      exports: providers,
      global: true,
    };
  }
}
