import { Model } from 'objection';
import knex from 'knex';
import { TableDataBuilder } from './table-builder';

function getConfig() {
  const { DB_TYPE, DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER, DB_POOL_SIZE } =
    process.env;
  return {
    client: DB_TYPE,
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      multipleStatements: true,
    },
    pool: { min: 0, max: DB_POOL_SIZE || 20 },
  };
}
function withKnex(config: any) {
  return knex(config);
}

Model.knex(withKnex(getConfig()));

export class BaseEntity extends Model {
  override QueryBuilderType!: TableDataBuilder<this>;
  static override QueryBuilder = TableDataBuilder;

  async $save() {
    if (this.$id()) {
      return await this.$query().patchAndFetch(this);
    }

    return await this.$query().insertAndFetch();
  }
}

export default BaseEntity;
