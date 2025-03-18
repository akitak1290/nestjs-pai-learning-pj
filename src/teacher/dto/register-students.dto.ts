import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterStudentsDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'teacherken@gmail.com',
    description: 'Teacher email',
  })
  teacher: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayMinSize(1)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @ApiProperty({
    example: '["studentjenny@gmail.com","studentlisa@gmail.com"]',
    description: 'Student emails',
  })
  students: string[];
}
