import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { StudentController } from '../student.controller';
import { StudentService } from '../student.service';
import { GlobalExceptionFilter } from 'src/common/filters/globalExceptionFilter';

describe(StudentController, () => {
  let app: INestApplication;
  let studentService: Partial<StudentService>;

  beforeAll(async () => {
    studentService = {
      suspendStudent: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [{ provide: StudentService, useValue: studentService }],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
    app.useLogger(false);
  });

  describe('/suspend route', () => {
    it('suspending a student with invalid email', async () => {
      return request(app.getHttpServer())
        .post('/suspend')
        .send({ email: 'abc' })
        .expect(400)
        .expect({
          errorType: 'BadRequestException',
          statusCode: 400,
          message: ['email must be an email'],
        });
    });

    it('suspending a student with empty request body', async () => {
      return request(app.getHttpServer())
        .post('/suspend')
        .expect(400)
        .expect({
          errorType: 'BadRequestException',
          statusCode: 400,
          message: ['email must be an email', 'email should not be empty'],
        });
    });

    it('suspending a student with valid email', async () => {
      return request(app.getHttpServer())
        .post('/suspend')
        .send({ email: 'abc@gmail.com' })
        .expect(204);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
