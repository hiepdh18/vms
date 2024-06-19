import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConnectDeviceDto {
  @ApiProperty({ example: '192.168.1.100' })
  @IsNotEmpty()
  host!: string;

  @ApiProperty({ default: 80, example: 80 })
  @IsNotEmpty()
  port!: number;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  password!: string;
}

export class ConnectDeviceOkDto {
  @ApiProperty()
  Manufacturer!: string;

  @ApiProperty()
  Model!: string;

  @ApiProperty()
  FirmwareVersion!: string;

  @ApiProperty()
  SerialNumber!: string;

  @ApiProperty()
  HardwareId!: string;
}
