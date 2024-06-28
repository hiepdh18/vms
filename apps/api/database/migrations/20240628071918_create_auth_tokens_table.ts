import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('auth_tokens', function (table) {
    table.increments();
    table
      .integer('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('token').notNullable();
    table.timestamps({ defaultToNow: true, useCamelCase: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('auth_tokens')
}
