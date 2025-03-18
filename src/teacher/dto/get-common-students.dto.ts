import { IsEmail, IsArray, ArrayMinSize } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetCommonStudentsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @ApiProperty({
    example: '["teacherken@gmail.com", "teacherzoe@gmail.com"]',
    description: 'Teacher emails',
  })
  teacher: string[];
}
