import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEmail } from 'class-validator';

export class GetStudentsByEmailsDto {
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayMinSize(1)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  students: string[];
}
