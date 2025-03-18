import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../student.service';
import { DataSource } from 'typeorm';
import { StudentRepository } from '../student.repository';
import { GetStudentsByEmailsDto } from '../dto/get-students-by-emails.dto';
import { Student } from '../student.entity';
import {
  StudentNotFoundException,
  StudentsNotFoundException,
} from 'src/common/exceptions/custom-exceptions';
import { SuspendStudentDto } from '../dto/suspend-student.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe(StudentService, () => {
  let service: StudentService;
  let studentRepository: StudentRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        StudentRepository,
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn(),
            createEntityManager: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Student),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            having: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            getRawMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepository = module.get<StudentRepository>(StudentRepository);
  });

  describe('getStudentsByEmails()', () => {
    it('should throw exception of some students cannot be found', () => {
      const validStudentEmail = 'validemail@gmail.com';
      const invalidStudentEmail = 'invalidemail@gmail.com';
      const getStudentsByEmailsDto: GetStudentsByEmailsDto = {
        students: [validStudentEmail, invalidStudentEmail],
      };
      const mockStudent = { email: validStudentEmail } as Student;

      jest.spyOn(studentRepository, 'find').mockResolvedValue([mockStudent]);

      expect(
        service.getStudentsByEmails(getStudentsByEmailsDto),
      ).rejects.toThrow(new StudentsNotFoundException());
    });

    it('should execute successfully with valid student emails', () => {
      const validStudentEmail1 = 'validemail1@gmail.com';
      const validStudentEmail2 = 'validemail@gmail.com';
      const getStudentsByEmailsDto: GetStudentsByEmailsDto = {
        students: [validStudentEmail1, validStudentEmail2],
      };
      const mockStudent1 = { email: validStudentEmail1 } as Student;
      const mockStudent2 = { email: validStudentEmail2 } as Student;

      jest
        .spyOn(studentRepository, 'find')
        .mockResolvedValue([mockStudent1, mockStudent2]);

      expect(
        service.getStudentsByEmails(getStudentsByEmailsDto),
      ).resolves.toEqual([mockStudent1, mockStudent2]);
    });
  });

  describe('findCommonStudents()', () => {
    // it('should ', () => {
    //   const mockStudents = [
    //     { email: 'student1@example.com' },
    //     { email: 'student2@example.com' },
    //   ];

    //   studentRepository
    //     .createQueryBuilder()
    //     .getRawMany().mockResolvedValue(mockStudents);
    //   expect(service.findCommonStudents(['a@gmail.com'])).rejects;
    // });
  });

  describe('suspendStudent()', () => {
    it('should throw an error if the student is not found', () => {
      const validStudentEmail = 'validemail@gmail.com';
      const suspendStudentDto: SuspendStudentDto = { email: validStudentEmail };

      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(null);

      expect(service.suspendStudent(suspendStudentDto)).rejects.toThrow(
        new StudentNotFoundException(),
      );
    });

    it('should execute successfully with valid student email', () => {
      const validStudentEmail = 'validemail@gmail.com';
      const suspendStudentDto: SuspendStudentDto = { email: validStudentEmail };
      const mockStudent: Student = {
        email: validStudentEmail,
        suspended: false,
        teachers: [],
      };

      jest.spyOn(studentRepository, 'findOne').mockResolvedValue(mockStudent);
      jest.spyOn(studentRepository, 'update').mockResolvedValue(null);

      expect(service.suspendStudent(suspendStudentDto)).resolves;
    });
  });
});
