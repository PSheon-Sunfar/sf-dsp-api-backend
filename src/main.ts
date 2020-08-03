import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as rateLimiter from 'express-rate-limit';
import { AppModule } from './app/app.module';

export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_API_NAME = 'API';
export const SWAGGER_API_DESCRIPTION = 'API Description';
export const SWAGGER_API_CURRENT_VERSION = '1.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });

  app.enableCors();
  app.use(helmet());
  app.use(
    rateLimiter({
      windowMs: 60, // 1 minutes
      max: 50, // limit each IP to 50 requests per windowMs
    }),
  );

  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addTag('API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
