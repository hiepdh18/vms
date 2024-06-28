import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('name').nullable();
    table.string('email').nullable();
    table.string('refreshToken').nullable();
    table.dateTime('lastLogin').nullable();
    table.boolean('isLocked').defaultTo(false);
    table.jsonb('settings').nullable().comment('Individual settings');
    table
      .integer('roleId')
      .notNullable()
      .references('id')
      .inTable('roles')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamps({ defaultToNow: true, useCamelCase: true });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
