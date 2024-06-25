import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('resources', function (table) {
    table.increments();
    table.string('key').notNullable();
    table.string('groupKey').notNullable();
    table.string('desc').nullable();
    table.timestamps({ defaultToNow: true, useCamelCase: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('resources');
}
