import { TableData } from "@vms/shared/base";
import { UserEntity } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class PagingDto implements TableData<UserEntity> {
  @ApiProperty({
    example: [],
    type: [UserEntity],
  })
  data: UserEntity[];

  @ApiProperty({
    example: 0,
  })
  total: number;

  @ApiProperty({
    example: 0,
  })
  page: number;

  @ApiProperty({
    example: 10,
  })
  pageSize: number;
}
