import { InjectKysely, KyselyInstance } from '@common/db';
import { Role } from '@common/roles';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { FilterCustomerDto } from '../dto/filter-customer.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

@Injectable()
export class PostgresUserRepository implements UserRepository {
  constructor(@InjectKysely private kysely: KyselyInstance) {}

  async updateUserProfile(id: number, dto: UpdateUserDto): Promise<User> {
    await this.kysely
      .updateTable('user')
      .set(dto)
      .where('id', '=', id)
      .executeTakeFirst();
    return this.kysely
      .selectFrom('user')
      .leftJoin('userRole', 'user.id', 'userRole.userId')
      .groupBy('user.id')
      .select((eb) => [
        'user.id',
        'user.email',
        'user.isActive',
        'user.name',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ])
      .where('user.id', '=', id)
      .executeTakeFirst();
  }

  async filterUser(filter: FilterCustomerDto): Promise<User[]> {
    if (!filter.search) filter.search = '';
    let query = this.kysely
      .selectFrom('user')
      .leftJoin('userRole', 'user.id', 'userRole.userId')
      .select((eb) => [
        'id',
        'email',
        'name',
        'isActive',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ])
      .groupBy('user.id')
      .where((eb) =>
        eb.or([
          eb('email', 'ilike', `%${filter.search}%`),
          eb('name', 'ilike', `%${filter.search}%`),
        ]),
      );
    if (String(filter.isActive) !== 'null')
      query = query.where('isActive', '=', filter.isActive);
    const customers = await query.execute();
    return customers;
  }

  async deactivateUser(id: number): Promise<User> {
    const deactivatedCustomer = await this.kysely
      .with('deactivatedUser', (eb) => {
        return eb
          .updateTable('user')
          .set({ isActive: false })
          .where('id', '=', id)
          .returning(['id', 'email', 'name', 'isActive']);
      })
      .selectFrom('deactivatedUser')
      .leftJoin('userRole', 'deactivatedUser.id', 'deactivatedUser.name')
      .select((eb) => [
        'id',
        'email',
        'name',
        'isActive',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ])
      .groupBy('deactivatedUser.id')
      .executeTakeFirst();
    return deactivatedCustomer;
  }

  async activateUser(id: number): Promise<User> {
    const activatedCustomer = await this.kysely
      .with('activatedUser', (eb) => {
        return eb
          .updateTable('user')
          .set({ isActive: true })
          .where('id', '=', id)
          .returning(['id', 'email', 'name', 'isActive']);
      })
      .selectFrom('activatedUser')
      .leftJoin('userRole', 'activatedUser.id', 'activatedUser.name')
      .select((eb) => [
        'id',
        'email',
        'name',
        'isActive',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ])
      .groupBy('activatedUser.id')
      .executeTakeFirst();
    return activatedCustomer;
  }

  async createAdmin(dto: CreateUserDto) {
    const createdAdmin = this.kysely.transaction().execute(async (trx) => {
      const createdUser = await trx
        .insertInto('user')
        .values(dto)
        .returning(['id', 'email', 'name', 'isActive'])
        .executeTakeFirst();
      await trx
        .insertInto('userRole')
        .values({
          userId: createdUser.id,
          roleName: Role.Admin,
        })
        .execute();
      return trx
        .selectFrom('user')
        .where('id', '=', createdUser.id)
        .leftJoin('userRole', 'userRole.userId', 'user.id')
        .select((eb) => [
          'id',
          'email',
          'name',
          'isActive',
          eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
        ])
        .groupBy('user.id')
        .executeTakeFirst();
    });
    return createdAdmin;
  }
  async createUser(dto: CreateUserDto) {
    const createdCustomer = this.kysely.transaction().execute(async (trx) => {
      const createdUser = await trx
        .insertInto('user')
        .values(dto)
        .returning(['id', 'email', 'name', 'isActive'])
        .executeTakeFirst();
      await trx
        .insertInto('userRole')
        .values({
          userId: createdUser.id,
          roleName: Role.User,
        })
        .execute();
      const user = await trx
        .selectFrom('user')
        .leftJoin('userRole', 'userRole.userId', 'user.id')
        .select((eb) => [
          'id',
          'email',
          'name',
          'isActive',
          eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
        ])
        .groupBy('user.id')
        .where('user.id', '=', createdUser.id)
        .executeTakeFirst();
      return user;
    });

    return createdCustomer;
  }

  async isUserActive(id: number): Promise<boolean> {
    const user = await this.kysely
      .selectFrom('user')
      .where('id', '=', id)
      .select('isActive')
      .executeTakeFirst();
    if (!user) throw new Error('User not found');
    return user.isActive;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.kysely
      .selectFrom('user')
      .where('email', '=', email)
      .leftJoin('userRole', 'userRole.userId', 'user.id')
      .select((eb) => [
        'id',
        'name',
        'email',
        'isActive',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ])
      .groupBy('user.id')
      .executeTakeFirst();
    return user;
  }

  async findUserByEmailForLogin(email: string) {
    const user = await this.kysely
      .selectFrom('user')
      .leftJoin('userRole', 'userRole.userId', 'user.id')
      .where('email', '=', email)
      .select((eb) => [
        'id',
        'name',
        'email',
        'isActive',
        'password',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ])
      .groupBy('user.id')
      .executeTakeFirst();
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.kysely
      .selectFrom('user')
      .leftJoin('userRole', 'userRole.userId', 'user.id')
      .where('id', '=', id)
      .select((eb) => [
        'id',
        'name',
        'email',
        'isActive',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ])
      .groupBy('user.id')
      .executeTakeFirst();
    return user;
  }

  async findAdmin(email?: string): Promise<User | null> {
    let query = this.kysely
      .selectFrom('user')
      .leftJoin('userRole', 'userRole.userId', 'user.id')
      .select((eb) => [
        'id',
        'name',
        'email',
        'isActive',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ]);

    if (email) query = query.where('email', '=', email);
    const admin = await query
      .where('userRole.roleName', '=', Role.Admin)
      .groupBy('user.id')
      .executeTakeFirst();
    return admin;
  }

  async findByEmailAndId(userId: number, email: string): Promise<User | null> {
    return this.kysely
      .selectFrom('user')
      .leftJoin('userRole', 'userRole.userId', 'user.id')
      .select((eb) => [
        'id',
        'name',
        'email',
        'isActive',
        eb.fn.jsonAgg(eb.ref('userRole.roleName')).as('roles'),
      ])
      .where((eb) => eb.and([eb('id', '=', userId), eb('email', '=', email)]))
      .executeTakeFirst();
  }
}
