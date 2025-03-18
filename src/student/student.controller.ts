import {
  Controller,
  Body,
  HttpCode,
  Post,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { SuspendStudentDto } from './dto/suspend-student.dto';
import { StudentService } from './student.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller()
export class StudentController {
  private readonly logger: Logger;
  constructor(private studentService: StudentService) {
    this.logger = new Logger(StudentController.name);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/suspend')
  @ApiOperation({ summary: 'Suspend a student by email' })
  @ApiBody({ type: SuspendStudentDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Student suspended',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request Exception - Validation Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'Student Not Found Exception - Student with provided email not found',
  })
  suspendStudent(@Body() suspendStudentDto: SuspendStudentDto): Promise<void> {
    this.logger.log(
      `Handling /suspendStudent with request body ${JSON.stringify(suspendStudentDto)}`,
    );
    return this.studentService.suspendStudent(suspendStudentDto);
  }
}
