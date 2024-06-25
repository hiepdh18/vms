import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'User role',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(125)
  name: string;

  @ApiProperty({
    example: 'Can only read',
  })
  @IsOptional()
  @MaxLength(255)
  desc: string;

  @ApiProperty({
    example: [
      {
        id: 1,
        value: 4,
      },
      {
        id: 2,
        value: 4,
      },
      {
        id: 3,
        value: 4,
      },
      {
        id: 4,
        value: 4,
      },
    ],
  })
  @IsNotEmpty()
  resources: Array<{ id: number; value: number }>;
}
