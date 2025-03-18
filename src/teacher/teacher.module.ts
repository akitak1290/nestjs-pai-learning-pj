import { Module } from '@nestjs/common';

import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { StudentModule } from 'src/student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { TeacherRepository } from './teacher.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher]), StudentModule],
  providers: [TeacherService, TeacherRepository],
  controllers: [TeacherController],
})
export class TeacherModule {}
