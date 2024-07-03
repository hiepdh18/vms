import { ApiProperty } from '@nestjs/swagger';
import { DTOMapper, MapFrom } from '@vms/shared/base';

export class TokenDto extends DTOMapper {
  @ApiProperty()
  @MapFrom()
  accessToken: string;

  @MapFrom()
  @ApiProperty()
  refreshToken: string;
}
