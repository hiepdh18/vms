import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('roles').del();

  // Inserts seed entries
  await knex('roles').insert([
    { id: 1, key: 'admin', name: 'Administrator' },
    { id: 2, key: 'user', name: 'Test User' },
  ]);

  // Update Id
  await knex.raw("select setval('roles_id_seq', max(id)) from roles");
}
