import { Model, Page, QueryBuilder, raw, val } from 'objection';
import dayjs from 'dayjs';
/**
 * example:
 * {
 *    "user.name": {
 *      field: "first",
 *      operation: "=",
 *      value: "John"
 *  }
 * }
 */
export interface FilterObject {
  [x: string]: {
    field: string;
    operation: string;
    value: string | any;
    matchCase?: string;
  };
}
// export interface SortObject {
//   [x: string]: { direction: 'asc' | 'desc' };
// }
export interface Sorter {
  field: string;
  direction: 'asc' | 'desc' | 'ascend' | 'descend';
}
export interface TableData<T extends object> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
class GetForTable<M extends Model, R = M[]> {
  builder: QueryBuilder<M, R>;
  constructor(builder: QueryBuilder<M, R>) {
    this.builder = builder;
  }

  getColumnName(columnName: string) {
    const match = columnName.match(/([a-zA-Z0-9]+)->(>?)([a-zA-Z0-9]+)/);
    if (match) {
      const index = columnName.indexOf(match[1]);
      if (index > 0) {
        const extra = columnName.substring(0, index - 1);
        return raw(`"${extra}"."${match[1]}"->${match[2]}'${match[3]}'`);
      }
      return raw(`"${match[1]}"->${match[2]}'${match[3]}'`);
    }
    return columnName;
  }

  buildFilters(filters: FilterObject) {
    console.log(JSON.stringify(filters));
    if (typeof filters == 'string') filters = JSON.parse(filters);
    const filterColumns = Object.keys(filters);
    for (const column of filterColumns) {
      const { field: fieldName, operation, value, matchCase } = filters[column];
      const field = column;
      const data = field.split('.');
      if (operation && value) {
        switch (operation) {
          case 'equals':
            if (field === 'age' && !Number(value)) {
              break;
            }
            this.builder.where(
              field,
              matchCase == 'true' ? 'LIKE' : 'ILIKE',
              value
            );
            break;

          case 'notEquals':
            this.builder.whereNot(
              field,
              matchCase == 'true' ? 'LIKE' : 'ILIKE',
              value
            );
            break;

          case 'contains':
            console.log(value);
            this.builder.where(
              field,
              matchCase == 'true' ? 'LIKE' : 'ILIKE',
              `%${value.replace(/%/, '%')}%`
            );
            break;

          case 'notContains':
            this.builder.whereNot(
              field,
              matchCase == 'true' ? 'LIKE' : 'ILIKE',
              `%${value.replace(/%/, '%')}%`
            );
            break;

          case 'beginsWith':
            this.builder.where(
              field,
              matchCase == 'true' ? 'LIKE' : 'ILIKE',
              `${value.replace(/%/, '%')}%`
            );
            break;

          case 'notBeginsWith':
            this.builder.whereNot(
              field,
              matchCase == 'true' ? 'LIKE' : 'ILIKE',
              `${value.replace(/%/, '%')}%`
            );
            break;

          case 'endsWith':
            this.builder.where(
              field,
              matchCase == 'true' ? 'LIKE' : 'ILIKE',
              `%${value.replace(/%/, '%')}`
            );
            break;

          case 'notEndsWith':
            this.builder.whereNot(
              field,
              matchCase == 'true' ? 'LIKE' : 'ILIKE',
              `%${value.replace(/%/, '%')}`
            );
            break;

          case 'between':
            this.builder.whereBetween(field, value);
            break;

          case 'in':
            this.builder.whereIn(field, value);
            break;

          case '=':
            this.builder.where(field, '=', value);
            break;

          case '!=':
            this.builder.where(field, '<>', value);
            break;

          case '>':
            this.builder.where(field, '>', value);
            break;

          case '>=':
            this.builder.where(field, '>=', value);
            break;

          case '<':
            this.builder.where(field, '<', value);
            break;

          case '<=':
            this.builder.where(field, '<=', value);
            break;

          case 'raw':
            if (data.length === 2) {
              try {
                this.builder.whereRaw(
                  `${data[0]} ->> '${data[1]}' like '%${value}%'`
                );
              } catch (error) {
                break;
              }
            }
            break;

          case 'time':
            try {
              //{"startTime":"2023-09-27 12:00:00","endTime":"2023-09-27 15:5:00"}
              const timeRate: any = JSON.parse(value);
              const startTime: any = new Date(timeRate.startTime);
              const endTime: any = new Date(timeRate.endTime);
              const checkTime = dayjs(startTime).isBefore(endTime);
              if (!isNaN(startTime) && !isNaN(endTime) && checkTime) {
                this.builder.whereBetween('time', [startTime, endTime]);
              }
            } catch (error) {
              break;
            }
            break;

          case 'startTime':
            try {
              //{"startTime":"2023-10-12 12:00:00","endTime":"2023-10-12 15:5:00"}
              const timeRate: any = JSON.parse(value);
              const startTime: any = new Date(timeRate.startTime);
              const endTime: any = new Date(timeRate.endTime);
              const checkTime = dayjs(startTime).isBefore(endTime);
              if (!isNaN(startTime) && !isNaN(endTime) && checkTime) {
                this.builder.whereBetween('startTime', [startTime, endTime]);
              }
            } catch (error) {
              break;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  buildSorters(sorters: Sorter[]) {
    if (typeof sorters == 'string') sorters = JSON.parse(sorters);
    const sorterColumns = Object.keys(sorters);

    for (const column of sorterColumns) {
      try {
        let direction: string = sorters[column];
        if (typeof direction === 'string')
          direction = direction.trim().toLowerCase();
        if (['asc', 'ascend'].includes(direction))
          this.builder.orderBy(column, 'ASC');
        if (['desc', 'descend'].includes(direction))
          this.builder.orderBy(column, 'DESC');
      } catch (e) {
        console.error(`sorter format invalid: ${JSON.stringify(sorters)}`);
      }
    }
  }

  // buildSorters(sorters?: SortObject) {
  //   const sorterColumns = Object.keys(sorters);
  //   for (const column of sorterColumns) {
  //     const { direction } = sorters[column];
  //     if (direction) {
  //       this.builder.orderBy(column, direction);
  //     }
  //   }
  // }

  async execute(params: {
    filters?: FilterObject;
    sorters?: Sorter[];
    pageSize?: number;
    page?: number;
    [x: string]: any;
  }): Promise<TableData<M>> {
    const { filters, sorters, pageSize, page } = params;
    if (filters) this.buildFilters(filters);
    if (sorters) this.buildSorters(sorters);
    console.log(
      'Actual Query: ' +
        this.builder
          .page(page || 0, pageSize || 10)
          .toKnexQuery()
          .toQuery()
    );
    const result = await this.builder.page(page || 0, pageSize || 10);
    return {
      data: result.results,
      total: result.total,
      page: page || 0,
      pageSize: pageSize || 10,
    };
  }
}
export class TableDataBuilder<M extends Model, R = M[]> extends QueryBuilder<
  M,
  R
> {
  override ArrayQueryBuilderType!: TableDataBuilder<M, M[]>;
  override SingleQueryBuilderType!: TableDataBuilder<M, M>;
  override MaybeSingleQueryBuilderType!: TableDataBuilder<M, M | undefined>;
  override NumberQueryBuilderType!: TableDataBuilder<M, number>;
  override PageQueryBuilderType!: TableDataBuilder<M, Page<M>>;

  async getForTable(params?: {
    filters?: FilterObject;
    sorters?: Sorter[];
    pageSize?: number;
    page?: number;
    [x: string]: any;
  }) {
    const getForTable = new GetForTable(this);
    const result = await getForTable.execute(params ? params : {});
    return result;
  }
}
