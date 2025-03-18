import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { TeacherController } from '../teacher.controller';
import { TeacherService } from '../teacher.service';
import {
  GlobalExceptionFilter,
} from 'src/common/filters/globalExceptionFilter';
import { HttpAdapterHost } from '@nestjs/core';

describe(TeacherController, () => {
  let app: INestApplication;
  let teacherService: Partial<TeacherService>;

  beforeAll(async () => {
    teacherService = {
      registerStudents: jest.fn().mockResolvedValue(undefined),
      retrieveForNotifications: jest.fn().mockResolvedValue(undefined),
      getCommonStudents: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [{ provide: TeacherService, useValue: teacherService }],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
    app.useLogger(false);
  });

  describe('/registerstudents route', () => {
    it('register student with invalid teacher email and empty students list', async () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ teacher: 'notavalidemail', students: [] })
        .expect(400)
        .expect({
          errorType: 'BadRequestException',
          statusCode: 400,
          message: [
            'teacher must be an email',
            'students must contain at least 1 elements',
          ],
        });
    });

    it('register student with invalid students email', async () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ teacher: 'validemail@gmail.com', students: ['notavalidemail'] })
        .expect(400)
        .expect({
          errorType: 'BadRequestException',
          statusCode: 400,
          message: ['each value in students must be an email'],
        });
    });

    it('register students with valid request body', async () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          teacher: 'teacherken@gmail.com',
          students: ['studentjenny@gmail.com', 'studentlisa@gmail.com'],
        })
        .expect(204);
    });
  });

  describe('/commonstudents route', () => {
    it('find common students with invalid teacher email', async () => {
      return request(app.getHttpServer())
        .get('/commonstudents')
        .query({ teacher: 'notavalidemail' })
        .expect(400)
        .expect({
          errorType: 'BadRequestException',
          statusCode: 400,
          message: ['each value in teacher must be an email'],
        });
    });

    it('find common students with no query parameter', async () => {
      return request(app.getHttpServer())
        .get('/commonstudents')
        .expect(400)
        .expect({
          errorType: 'BadRequestException',
          statusCode: 400,
          message: [
            'each value in teacher must be an email',
            'teacher must contain at least 1 elements',
            'teacher must be an array',
          ],
        });
    });

    it('find common students with valid query parameter', async () => {
      return request(app.getHttpServer())
        .get('/commonstudents')
        .query({ teacher: 'validemail@gmail.com' })
        .expect(200);
    });
  });

  describe('/retrievefornotifications route', () => {
    it('get recipients with invalid teacher email', async () => {
      return request(app.getHttpServer())
        .post('/retrievefornotifications')
        .send({ teacher: 'notavalidemail', notification: '' })
        .expect(400)
        .expect({
          errorType: 'BadRequestException',
          statusCode: 400,
          message: [
            'teacher must be an email',
            'notification should not be empty',
          ],
        });
    });

    it('get recipients with valid request body', async () => {
      return request(app.getHttpServer())
        .post('/retrievefornotifications')
        .send({
          teacher: 'teacherken@gmail.com',
          notification:
            'Hello students! @studentjohn@gmail.com @studentgevin@gmail.com',
        })
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
