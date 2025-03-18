import { IsEmail } from 'class-validator';
import { Teacher } from 'src/teacher/teacher.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('Student')
export class Student {
  @PrimaryColumn()
  @IsEmail()
  email: string;

  @Column({ default: false })
  suspended: boolean;

  @ManyToMany(() => Teacher, (teacher: Teacher) => teacher.students)
  teachers: Teacher[];
}
