import { Student } from 'src/student/student.entity';
import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('Teacher')
export class Teacher {
  @PrimaryColumn()
  email: string;

  @ManyToMany(() => Student, (student: Student) => student.teachers, {
    eager: true,
  })
  @JoinTable({
    name: 'TeacherStudent',
  })
  students: Student[];
}
