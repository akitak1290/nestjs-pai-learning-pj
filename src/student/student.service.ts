import { Injectable, Logger, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { StudentRepository } from './student.repository';
import { Student } from './student.entity';
import { SuspendStudentDto } from './dto/suspend-student.dto';
import { GetStudentsByEmailsDto } from './dto/get-students-by-emails.dto';

@Injectable()
export class StudentService {
  private readonly logger: Logger;
  private readonly validationPipe: ValidationPipe;
  constructor(private studentRepository: StudentRepository) {
    this.logger = new Logger(StudentService.name);
    this.validationPipe = new ValidationPipe();
  }

  async getStudentsByEmails(
    getStudentsByEmailsDto: GetStudentsByEmailsDto,
  ): Promise<Student[]> {
    // ! as this service is called by another service,
    // we need to manually invoke the ValidationPipe for dto validation
    const validateData = plainToInstance(
      GetStudentsByEmailsDto,
      getStudentsByEmailsDto,
    );
    await this.validationPipe.transform(validateData, {
      type: 'body',
      metatype: GetStudentsByEmailsDto,
    });

    return this.studentRepository.getStudentsByEmails(getStudentsByEmailsDto);
  }

  // TODO: mark this as a helper method, not to be called directly by controller layer
  async findCommonStudents(teacherEmails: string[]) {
    const commonStudents =
      await this.studentRepository.getStudentsByTeacherEmails(teacherEmails);
    this.logger.debug(
      `Method ${this.findCommonStudents.name}: found students ${JSON.stringify(commonStudents.map((student) => student.email))} registered for teachers ${JSON.stringify(teacherEmails)}`,
    );
    return commonStudents.map((student) => student.email);
  }

  async suspendStudent(suspendStudentDto: SuspendStudentDto): Promise<void> {
    const { email } = suspendStudentDto;
    return this.studentRepository.updateStudentSuspendedStatus(email, true);
  }
}
