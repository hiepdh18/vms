import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class SettingDeviceOkDto {
    @ApiProperty()
    @IsOptional()
    resolution: string;
  
    @ApiProperty()
    @IsOptional()
    framerate: string;
  
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    bitrate: number;
  
    @ApiProperty()
    @IsOptional()
    encoding: string;
  
  }