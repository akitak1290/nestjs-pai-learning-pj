import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RetrieveForNotificationsDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'teacherken@gmail.com',
    description: 'Teacher email',
  })
  teacher: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Welcome student @studentpeter@gmail.com',
    description: 'Notification',
  })
  notification: string;
}
