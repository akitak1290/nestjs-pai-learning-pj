import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '../src/app.module';
import { config as DataSourceConfig } from '../src/config/database.config';
import { GlobalExceptionFilter } from '../src/common/filters/globalExceptionFilter';

import 'dotenv/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockConfig = {
      ...DataSourceConfig,
      port: parseInt(process.env.DB_TEST_HOST_PORT),
      host: 'mysqldb-test',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };
    console.log(mockConfig);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot(mockConfig)],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  it('/api/register (POST)', async () => {
    await request(app.getHttpServer())
      .post('/register')
      .send({
        teacher: 'teacherken@gmail.com',
        students: ['studentjenny@gmail.com', 'studentlisa@gmail.com'],
      })
      .expect(204);

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
  });

  it('/api/commonstudents (GET)', async () => {
    await request(app.getHttpServer())
      .get('/commonstudents?teacher=teacherash%40gmail.com')
      .expect({});

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
  });

  afterAll(async () => {
    await app.close();
  });
});
