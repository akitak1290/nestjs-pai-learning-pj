import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuspendStudentDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'studentpeter@gmail.com',
    description: 'Student email',
  })
  'email': string;
}
