import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { StudentRepository } from './student.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentService, StudentRepository],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
