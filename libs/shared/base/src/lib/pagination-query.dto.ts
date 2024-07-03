import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class Filter {
  @ApiProperty({ required: false })
  @IsOptional()
  field: string;

  @ApiProperty({ required: false })
  @IsOptional()
  value: string;

  @ApiProperty({ required: false })
  @IsOptional()
  operation: string;

  @ApiProperty({ required: false })
  @IsOptional()
  matchCase?: string;
}

class Sorter {
  @ApiProperty({ required: false })
  @IsOptional()
  field: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  direction: 'asc' | 'desc' | 'ascend' | 'descend';
}

export class PaginationQueryDto {
  @ApiProperty({
    required: false,
    type: 'object',
    example: {
      filters: {
        username: {
          field: '',
          value: 'admin',
          operation: 'equals',
          matchCase: false,
        },
      },
    },
  })
  @IsOptional()
  filters: { [x: string]: Filter };

  @ApiProperty({ required: false, type: 'object', isArray: true })
  @IsOptional()
  sorters: Sorter[];

  @ApiProperty({
    required: false,
    minimum: 0,
    maximum: 10000,
    title: 'Page',
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    format: 'int32',
    default: 0,
  })
  @IsOptional()
  page: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  pageSize: number;
}
