import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'admin',
  })
  @IsString()
  username: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsString()
  password!: string;
}
