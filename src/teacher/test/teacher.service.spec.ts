import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from '../teacher.service';
import { TeacherRepository } from '../teacher.repository';
import { StudentService } from 'src/student/student.service';
import { NotFoundException } from '@nestjs/common';
import { RegisterStudentsDto } from '../dto/register-students.dto';
import { Teacher } from '../teacher.entity';
import { DataSource } from 'typeorm';
import { Student } from 'src/student/student.entity';
import { RetrieveForNotificationsDto } from '../dto/retrieve-for-notifications.dto';

/*
 * !methods from external modules (typeORM) or external services (StudentService)
 * are mocked to test methods from TeacherService
 */

describe(TeacherService, () => {
  let service: TeacherService;
  let teacherRepository: TeacherRepository;
  let studentService: StudentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        TeacherRepository,
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn(),
            createEntityManager: jest.fn(),
          },
        },
        {
          provide: StudentService,
          useValue: {
            getStudentsByEmails: jest.fn(),
            findCommonStudents: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<TeacherRepository>(TeacherRepository);
    studentService = module.get<StudentService>(StudentService);
  });

  it('main service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerStudents()', () => {
    it('should throw an error if the teacher is not found', async () => {
      const teacherEmail = 'nonexistent@example.com';
      const mockTeacher = { teacher: teacherEmail } as RegisterStudentsDto;

      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(null);

      expect(service.registerStudents(mockTeacher)).rejects.toThrow(
        new NotFoundException(`Can't find teacher with email ${teacherEmail}`),
      );
    });

    it('should execute successfully with valid teacher email and valid students list', async () => {
      const teacherEmail = 'validteacher@example.com';
      const studentEmail = 'validteacher@example.com';
      const mockTeacher = { email: teacherEmail, students: [] } as Teacher;
      const mockStudent = { email: studentEmail, suspended: false } as Student;

      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(mockTeacher);
      jest.spyOn(teacherRepository, 'save').mockResolvedValue(null);
      jest
        .spyOn(studentService, 'getStudentsByEmails')
        .mockResolvedValue([mockStudent]);

      expect(
        service.registerStudents({
          teacher: teacherEmail,
          students: [studentEmail],
        }),
      ).resolves;
    });

    it('should returns an error if the teacher is not found', async () => {
      const teacherEmail = 'nonexistent@example.com';
      const mockTeacher = { email: teacherEmail } as Teacher;

      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(mockTeacher);
    });
  });

  describe('getCommonStudents()', () => {
    it('should resolves successfully', () => {
      expect(service.getCommonStudents({ teacher: [] })).resolves;
    });
  });

  describe('retrieveForNotifications()', () => {
    it('should throw an exception if the teacher is not found', () => {
      const teacherEmail = 'nonexistence@gmail.com';
      const retrieveForNotificationsDto: RetrieveForNotificationsDto = {
        teacher: teacherEmail,
        notification: '',
      };

      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(null);

      expect(
        service.retrieveForNotifications(retrieveForNotificationsDto),
      ).rejects.toThrow(
        new NotFoundException(`Can't find teacher with email ${teacherEmail}`),
      );
    });

    it('should execute successfully with valid teacher email and valid notification', () => {
      const teacherEmail = 'validteacheremail@gmail.com';
      const studentEmail1 = 'validstudentemail@gmail.com';
      const studentEmail2 = 'validstudentemail2@gmail.com';

      const retrieveForNotificationsDto: RetrieveForNotificationsDto = {
        teacher: teacherEmail,
        notification: `You are late @${studentEmail2} `,
      };
      const mockStudent = { email: studentEmail1, suspended: false } as Student;
      const mockTeacher = {
        email: teacherEmail,
        students: [mockStudent],
      } as Teacher;
      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(mockTeacher);

      expect(
        service.retrieveForNotifications(retrieveForNotificationsDto),
      ).resolves.toEqual({
        recipients: [studentEmail1, studentEmail2],
      });
    });

    it('should not contain duplicated emails', () => {
      const teacherEmail = 'validteacheremail@gmail.com';
      const studentEmail1 = 'validstudentemail@gmail.com';
      const studentEmail2 = 'validstudentemail2@gmail.com';

      const retrieveForNotificationsDto: RetrieveForNotificationsDto = {
        teacher: teacherEmail,
        notification: `You are late @${studentEmail2} `,
      };
      const mockStudent1 = { email: studentEmail1, suspended: false } as Student;
      const mockStudent2 = { email: studentEmail2, suspended: false } as Student;
      const mockTeacher = {
        email: teacherEmail,
        students: [mockStudent1, mockStudent2],
      } as Teacher;

      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(mockTeacher);

      expect(
        service.retrieveForNotifications(retrieveForNotificationsDto),
      ).resolves.toEqual({
        recipients: [studentEmail1, studentEmail2],
      });
    });
  });
});
