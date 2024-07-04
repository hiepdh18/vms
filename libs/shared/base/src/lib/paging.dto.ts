import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, TableData } from '@vms/shared/base';

export class PagingDto implements TableData<BaseEntity> {
  @ApiProperty({
    example: [],
    type: [BaseEntity],
  })
  data: BaseEntity[];

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
