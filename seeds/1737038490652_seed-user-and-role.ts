import { hash } from 'bcryptjs';
import type { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';

async function createUser(db: Kysely<DB>) {
  const hashedPassword = await hash('Username730`', 10);
  const user = await db
    .insertInto('user')
    .values({
      name: 'Admin',
      email: 'admin@example.com',
      isActive: true,
      password: hashedPassword,
    })
    .returning('user.id')
    .executeTakeFirst();
  return db
    .insertInto('userRole')
    .values({
      userId: user.id,
      roleName: 'admin',
    })
    .executeTakeFirstOrThrow();
}

export async function seed(db: Kysely<DB>): Promise<void> {
  await createUser(db);
}
