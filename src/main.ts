import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import {
  GlobalExceptionFilter,
} from './common/filters/globalExceptionFilter';

import * as dotenv from 'dotenv';
import SwaggerConfig from './config/swagger.config';
import { baseEndpointPath } from './types/constants';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SETUP Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // SETUP Filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // SETUP Logger
  app.useLogger(
    process.env.NODE_ENV === 'prod'
      ? ['log', 'error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  );

  // SETUP Swagger
  const swaggerDocument = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup(baseEndpointPath, app, swaggerDocument);

  app.setGlobalPrefix(baseEndpointPath);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
