import { HttpException, HttpStatus } from '@nestjs/common';

export class StudentsNotFoundException extends HttpException {
  constructor() {
    super('Some students not found', HttpStatus.NOT_FOUND);
  }
}

export class StudentNotFoundException extends HttpException {
  constructor() {
    super('Student not found', HttpStatus.NOT_FOUND);
  }
}

export class TeachersNotFoundException extends HttpException {
  constructor() {
    super('Some teachers not found', HttpStatus.NOT_FOUND);
  }
}

export class TeacherNotFoundException extends HttpException {
  constructor() {
    super('Teacher not found', HttpStatus.NOT_FOUND);
  }
}
