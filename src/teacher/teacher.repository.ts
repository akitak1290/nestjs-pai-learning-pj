import { Repository, DataSource } from 'typeorm';

import { Teacher } from './teacher.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Student } from 'src/student/student.entity';

@Injectable()
export class TeacherRepository extends Repository<Teacher> {
  constructor(private dataSource: DataSource) {
    super(Teacher, dataSource.createEntityManager());
  }

  async getTeacher(teacherEmail: string): Promise<Teacher> {
    const teacher = await this.findOne({ where: { email: teacherEmail } });

    if (!teacher) {
      throw new NotFoundException(
        `Can't find teacher with email ${teacherEmail}`,
      );
    }

    return teacher;
  }

  async addStudentsForTeacher(
    teacher: Teacher,
    students: Student[],
  ): Promise<void> {
    teacher.students = [...teacher.students, ...students];
    try {
      this.save(teacher);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
