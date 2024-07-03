import { DTOMapper, MapFrom } from '@vms/shared/base';

export class UserDto extends DTOMapper {
  @MapFrom()
  id!: number;

  @MapFrom((data) => data.username)
  username!: string;

  @MapFrom('email')
  email!: string;

  @MapFrom()
  name!: string;

  @MapFrom()
  roleId!: number;

  @MapFrom()
  settings: any;

  @MapFrom()
  refreshToken!: string;

  @MapFrom()
  password!: string;

  @MapFrom()
  isLocked!: boolean;

  @MapFrom()
  lastLogin!: Date;
}
