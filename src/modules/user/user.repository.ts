import { CreateUserDto } from './dto/create-user.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export interface UserRepository {
  updateUserProfile(id: number, dto: UpdateUserDto): Promise<User>;
  createAdmin(dto: CreateUserDto): Promise<User>;
  createUser(dto: CreateUserDto): Promise<User>;
  activateUser(id: number): Promise<User>;
  deactivateUser(id: number): Promise<User>;
  filterUser(filter: FilterCustomerDto): Promise<User[]>;
  isUserActive(id: number): Promise<boolean>;
  findUserByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findAdmin(email?: string): Promise<User | null>;
  findUserByEmailForLogin(
    email: string,
  ): Promise<(User & { password: string }) | null>;
}
