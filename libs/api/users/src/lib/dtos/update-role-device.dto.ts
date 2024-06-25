import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateRoleDeviceDto {
  @ApiProperty()
  @IsNotEmpty()
  deviceIds: Array<number>
}
