import { ApiProperty } from "@nestjs/swagger";

export class ProbeDeviceOkDto {
  @ApiProperty()
  urn: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  hardware: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  types: string[];

  @ApiProperty()
  xaddrs: string[];

  @ApiProperty()
  scopes: string[];
}
