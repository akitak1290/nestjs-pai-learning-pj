import { DataSource, Repository, In } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Student } from './student.entity';
import { GetStudentsByEmailsDto } from './dto/get-students-by-emails.dto';
import {
  StudentNotFoundException,
  StudentsNotFoundException,
} from 'src/common/exceptions/custom-exceptions';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  async getStudent(studentEmail: string): Promise<Student> {
    const student: Student = await this.findOne({
      where: { email: studentEmail },
    });

    if (!student) {
      throw new StudentNotFoundException();
    }

    return student;
  }

  async getStudentsByEmails(
    getStudentsByEmailsDto: GetStudentsByEmailsDto,
  ): Promise<Student[]> {
    const { students: studentEmails } = getStudentsByEmailsDto;

    const students = await this.find({ where: { email: In(studentEmails) } });

    if (students.length !== studentEmails.length) {
      throw new StudentsNotFoundException();
    }

    return students;
  }

  async getStudentsByTeacherEmails(
    teacherEmails: string[],
  ): Promise<Student[]> {
    const teacherCount = teacherEmails.length;
    return this.createQueryBuilder('student')
      .leftJoin('student.teachers', 'teacher')
      .select('student.email', 'email')
      .groupBy('student.email')
      .having('COUNT(DISTINCT teacher.email) = :teacherCount', { teacherCount })
      .where('teacher.email IN (:...teacherEmails)', { teacherEmails })
      .getRawMany();
  }

  async updateStudentSuspendedStatus(
    studentEmail: string,
    status: boolean,
  ): Promise<void> {
    const student: Student = await this.getStudent(studentEmail);

    this.update(student.email, { suspended: status });
  }
}
