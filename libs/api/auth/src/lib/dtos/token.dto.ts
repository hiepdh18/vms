import { DTOMapper, MapFrom } from '@vms/shared/base';

export class TokenDto extends DTOMapper {
  @MapFrom()
  accessToken: string;

  @MapFrom()
  refreshToken: string;
}
