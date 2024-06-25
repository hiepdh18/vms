import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('resources').del();

  // Inserts seed entries
  await knex('resources').insert([
    { id: 1, key: 'manage_camera', desc: 'Manage cameras', groupKey: 1 },
    { id: 2, key: 'user', desc: 'Manage Users', groupKey: 2 },
  ]);

  // Update Id
  await knex.raw("select setval('resources_id_seq', max(id)) from resources");
}
