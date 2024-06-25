import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('permissions').del();

  // Inserts seed entries
  await knex('permissions').insert([
    { id: 1, roleId: 1, resourceId: 1, value: 15 },
    { id: 2, roleId: 1, resourceId: 2, value: 15 },
    { id: 3, roleId: 2, resourceId: 1, value: 7 },
    { id: 4, roleId: 2, resourceId: 2, value: 7 },
  ]);

  // Update Id
  await knex.raw("select setval('permissions_id_seq', max(id)) from permissions");
}
