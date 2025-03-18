import { Injectable, Logger } from '@nestjs/common';

import { TeacherRepository } from './teacher.repository';
import { StudentService } from 'src/student/student.service';
import { RegisterStudentsDto } from './dto/register-students.dto';
import { Student } from 'src/student/student.entity';
import { Teacher } from './teacher.entity';
import { RetrieveForNotificationsDto } from './dto/retrieve-for-notifications.dto';
import { extractEmails } from 'src/utils/extractEmails';
import { GetCommonStudentsDto } from './dto/get-common-students.dto';
// import { GetCommonStudentsDto } from './dto/get-common-students.dto';

@Injectable()
export class TeacherService {
  private readonly logger: Logger;
  constructor(
    private teacherRepository: TeacherRepository,
    private readonly studentService: StudentService,
  ) {
    this.logger = new Logger(TeacherService.name);
  }

  async registerStudents(
    registerStudentsDto: RegisterStudentsDto,
  ): Promise<void> {
    const { teacher: teacherEmail, students: studentEmails } =
      registerStudentsDto;

    const teacher: Teacher =
      await this.teacherRepository.getTeacher(teacherEmail);
    const students: Student[] = await this.studentService.getStudentsByEmails({
      students: studentEmails,
    });
    this.logger.debug(
      `Method ${this.registerStudents.name}: got teachers ${teacher.email} and student ${students.map((student) => student.email)}`,
    );

    return this.teacherRepository.addStudentsForTeacher(teacher, students);
  }

  async getCommonStudents(
    getCommonStudentsDto: GetCommonStudentsDto,
  ): Promise<string[]> {
    const { teacher: teacherEmails } = getCommonStudentsDto;
    this.logger.debug(
      `Method ${this.getCommonStudents.name}: got teachers ${JSON.stringify(teacherEmails)}`,
    );
    return this.studentService.findCommonStudents(teacherEmails);
  }

  async retrieveForNotifications(
    retrieveForNotificationsDto: RetrieveForNotificationsDto,
  ): Promise<{ recipients: string[] }> {
    const { teacher: teacherEmail, notification } = retrieveForNotificationsDto;

    // 1. get from teacher's registration list
    const teacher = await this.teacherRepository.getTeacher(teacherEmail);
    const studentEmails = teacher.students
      .filter((student) => !student.suspended)
      .map((student) => student.email);
    // 2. extract from notification
    const extractedEmails = extractEmails(notification);
    studentEmails.push(...extractedEmails);

    this.logger.debug(
      `Method ${this.retrieveForNotifications.name}: got ${JSON.stringify(studentEmails)} students registered to teacher ${teacher.email} and ${JSON.stringify(extractedEmails)} from message: ${notification}`,
    );

    return { recipients: [...new Set(studentEmails)] };
  }
}
