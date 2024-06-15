import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

class Filter {
  @ApiProperty({ required: false })
  @IsOptional()
  field: string;

  @ApiProperty({ required: false })
  @IsOptional()
  value: string;

  @ApiProperty({ required: false })
  @IsOptional()
  operator: string;

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
  direction: string;
}

export class PaginationQueryDto {
  @ApiProperty({ required: false, type: 'object', isArray: true })
  @IsOptional()
  filters: Filter[];

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

  @ApiProperty({ required: false })
  @IsOptional()
  pageSize: number;
}
