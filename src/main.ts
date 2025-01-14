import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      name: 'Authorization',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {});

  app.use('/api', apiReference({ spec: { content: document } }));

  await app.listen(3000);
}
bootstrap();
