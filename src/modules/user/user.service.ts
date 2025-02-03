import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { PasswordHasher } from '../hasher/interface';
import { NotificationEvent } from '../notification/event';
import { NotificationService } from '../notification/notification.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private hasher: PasswordHasher,
    private notification: NotificationService,
    @Inject('kysely_postgres_user') private repository: UserRepository,
  ) {}

  /**
   * for one-time use only(when bootstrapping the app)
   **/
  async bootstrapAdmin(dto: CreateUserDto) {
    const existingAdmin = await this.repository.findAdmin();
    if (existingAdmin) throw new BadRequestException('Admin already exists');
    dto.password = await this.hasher.hashPassword(dto.password);
    try {
      const admin = await this.repository.createAdmin(dto);
      return admin;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * will not throws exception if user is not found
   */
  async findUserByEmail(email: string) {
    const user = await this.repository.findUserByEmailForLogin(email);
    return user;
  }

  async updateUserProfile(id: number, dto: UpdateUserDto) {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    try {
      if (dto.password) {
        dto.password = await this.hasher.hashPassword(dto.password);
      }
      return this.repository.updateUserProfile(id, dto);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createCustomer(dto: CreateUserDto) {
    dto.password = await this.hasher.hashPassword(dto.password);
    const user = await this.repository.findUserByEmail(dto.email);
    if (user) throw new BadRequestException('Email already exists');

    try {
      const createdCustomer = await this.repository.createUser(dto);
      this.notification.send(
        NotificationEvent.UserRegistered,
        createdCustomer.id,
        'account created',
      );
      return createdCustomer;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async activateCustomer(id: number) {
    const isActive = await this.repository.isUserActive(id);
    if (isActive) throw new BadRequestException('User already activated');
    try {
      const activatedCustomer = await this.repository.activateUser(id);
      return activatedCustomer;
    } catch (error) {
      throw new InternalServerErrorException('Cannot activate customer');
    }
  }

  async deactivateCustomer(id: number) {
    const isActive = await this.repository.isUserActive(id);
    if (!isActive) throw new BadRequestException('User already deactivated');
    try {
      const deactivatedCustomer = await this.repository.deactivateUser(id);
      return deactivatedCustomer;
    } catch (error) {
      throw new InternalServerErrorException('Cannot deactivate customer');
    }
  }

  async filterCustomer(filter: FilterCustomerDto) {
    return this.repository.filterUser(filter);
  }

  async findById(id: number) {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async setPassword(userId: number, newPassword: string) {
    const user = await this.repository.updateUserProfile(userId, {
      password: newPassword,
    });
    return user;
  }
}
