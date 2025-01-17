import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { KYSELY_INSTANCE } from '@common/db';
import { Role } from '@common/roles';
import { vi } from 'vitest';
import { HasherModule } from '../hasher/hasher.module';
import { PasswordHasher } from '../hasher/interface';
import { NotificationEvent } from '../notification/event';
import { NotificationService } from '../notification/notification.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

const existingAdmin: User = {
  id: 1,
  name: 'Admin',
  email: 'existing@admin.com',
  roles: [Role.Admin],
  isActive: true,
};
const existingUser = {
  id: 2,
  name: 'user',
  email: 'existing@user.com',
  roles: [Role.User],
  isActive: true,
};
const mockNotificationService = {
  send: vi.fn(),
};

const mockConfigService = {
  get: vi.fn(),
};
const mockRepository: UserRepository = {
  updateUserProfile: vi.fn(),
  createAdmin: vi.fn(),
  createUser: vi.fn(),
  activateUser: vi.fn(),
  findById: vi.fn(),
  findUserByEmail: vi.fn(),
  findAdmin: vi.fn(),
  filterUser: vi.fn(),
  isUserActive: vi.fn(),
  deactivateUser: vi.fn(),
  findUserByEmailForLogin: vi.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let hasher: PasswordHasher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: 'kysely_postgres_user', useValue: mockRepository },
      ],
      imports: [HasherModule],
    })
      .useMocker((token) => {
        if (token == NotificationService) {
          return mockNotificationService;
        }
        if (token == ConfigService) {
          return mockConfigService;
        }
        if (token == KYSELY_INSTANCE) return {};
      })
      .compile();
    userService = module.get(UserService);
    hasher = module.get(PasswordHasher);
  });

  it('UserService should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('bootstrap admin', () => {
    it('should throw error when admin is existed', async () => {
      let createError: Error;
      vi.spyOn(mockRepository, 'findAdmin').mockImplementation(async () => {
        return existingAdmin;
      });
      vi.spyOn(hasher, 'hashPassword');
      try {
        await userService.bootstrapAdmin({
          email: existingAdmin.email,
          name: existingAdmin.name,
          password: 'Useradmin@730',
        });
      } catch (error) {
        createError = error;
      }

      expect(mockRepository.findAdmin).toHaveBeenCalled();
      expect(hasher.hashPassword).not.toHaveBeenCalled();
      expect(createError).toBeInstanceOf(BadRequestException);
    });

    it("create admin when it's not existed", async () => {
      vi.spyOn(mockRepository, 'findAdmin').mockImplementation(async () => {
        return null;
      });
      vi.spyOn(hasher, 'hashPassword').mockImplementation(async () => {
        return 'hashed';
      });
      vi.spyOn(mockRepository, 'createAdmin').mockImplementation(async () => {
        return existingAdmin;
      });
      const admin = await userService.bootstrapAdmin({
        email: existingAdmin.email,
        name: existingAdmin.name,
        password: 'Useradmin@730',
      });
      expect(mockRepository.findAdmin).toHaveBeenCalled();
      expect(hasher.hashPassword).toHaveBeenCalled();
      expect(mockRepository.createAdmin).toHaveBeenCalled();
      expect(admin).toEqual(existingAdmin);
    });

    it('throws internal server error when create admin throw error', async () => {
      let createError: Error;
      vi.spyOn(mockRepository, 'createAdmin').mockImplementation(async () => {
        throw new Error('error');
      });
      try {
        await userService.bootstrapAdmin({
          email: existingAdmin.email,
          name: existingAdmin.name,
          password: 'Useradmin@730',
        });
      } catch (error) {
        createError = error;
      }
      expect(createError).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('findUserByEmail', () => {
    vi.spyOn(mockRepository, 'findUserByEmailForLogin').mockImplementation(
      async (email) => {
        if (email === existingUser.email) {
          const user = { ...existingUser, password: '' };
          return user;
        }
        if (email === existingAdmin.email) {
          const admin = { ...existingAdmin, password: '' };
          return admin;
        }
        return undefined;
      },
    );
    it('should return user when user is existed', async () => {
      const user = await userService.findUserByEmail(existingUser.email);
      expect(user).toMatchObject(existingUser);
    });
    it("should throw NotFoundException when user isn't existed", async () => {
      let findError: Error;
      try {
        await userService.findUserByEmail('random@email.com');
      } catch (error) {
        findError = error;
      }
      expect(findError).not.toBeDefined();
    });
  });

  describe('updateUserProfile', () => {
    it("should throw NotFoundException when user isn't existed", async () => {
      let findError: Error;
      vi.spyOn(mockRepository, 'findById').mockImplementation(async () => {
        return null;
      });
      try {
        await userService.updateUserProfile(1, existingUser);
      } catch (error) {
        findError = error;
      }
      expect(findError).toBeInstanceOf(NotFoundException);
    });

    it("should hash the password if it's provided", async () => {
      vi.spyOn(mockRepository, 'findById').mockImplementation(async () => {
        return existingUser;
      });
      vi.spyOn(hasher, 'hashPassword').mockImplementation(async () => {
        return 'hashed';
      });
      vi.spyOn(mockRepository, 'updateUserProfile').mockImplementation(
        async () => {
          return existingUser;
        },
      );
      const updatedUser = await userService.updateUserProfile(1, {
        ...existingUser,
        password: 'Useradmin@730',
      });
      expect(hasher.hashPassword).toHaveBeenCalled();
      expect(updatedUser).toEqual(existingUser);
    });

    it("should not hash the password if it's not provided", async () => {
      vi.spyOn(mockRepository, 'findById').mockImplementation(async () => {
        return existingUser;
      });
      vi.spyOn(hasher, 'hashPassword');
      vi.spyOn(mockRepository, 'updateUserProfile').mockImplementation(
        async () => {
          return existingUser;
        },
      );
      const updatedUser = await userService.updateUserProfile(1, {
        ...existingUser,
      });
      expect(hasher.hashPassword).not.toHaveBeenCalled();
      expect(updatedUser).toEqual(existingUser);
    });
  });

  describe('createCustomer', () => {
    vi.spyOn(mockRepository, 'findUserByEmail').mockImplementation(
      async (email) => {
        if (email === existingUser.email) {
          return existingUser;
        }
        if (email === existingAdmin.email) {
          return existingAdmin;
        }
        return undefined;
      },
    );
    vi.spyOn(mockRepository, 'createUser').mockImplementation((user) =>
      Promise.resolve({ id: 1, ...user, isActive: false, roles: [Role.User] }),
    );

    it('has the password first', async () => {
      const dto = {
        email: '',
        name: '',
        password: 'password',
      };
      vi.spyOn(hasher, 'hashPassword');
      await userService.createCustomer(dto);
      expect(hasher.hashPassword).toHaveBeenCalled();
    });

    it("throw error if user's email is existed", async () => {
      let createError: Error;
      try {
        await userService.createCustomer({
          email: existingUser.email,
          name: existingUser.name,
          password: 'Useradmin',
        });
      } catch (error) {
        createError = error;
      }
      expect(createError).toBeInstanceOf(BadRequestException);
      expect(createError.message).toBe('Email already exists');
    });

    it('should send notification and return created user', async () => {
      vi.spyOn(mockNotificationService, 'send');
      const createdUser = await userService.createCustomer({
        email: 'new@gmail.com',
        name: 'new member',
        password: 'password',
      });
      expect(mockNotificationService.send).toHaveBeenCalledWith(
        NotificationEvent.USER_REGISTERED,
        createdUser.id,
        'account created',
      );
    });
  });

  describe('activateCustomer', () => {
    it('should throw BadRequestException when user is already activated', async () => {
      let activateError: Error;
      vi.spyOn(mockRepository, 'isUserActive').mockImplementation(async () => {
        return true;
      });
      try {
        await userService.activateCustomer(1);
      } catch (error) {
        activateError = error;
      }
      expect(activateError).toBeInstanceOf(BadRequestException);
    });
    it('should activate user and return it', async () => {
      vi.spyOn(mockRepository, 'isUserActive').mockImplementation(async () => {
        return false;
      });
      vi.spyOn(mockRepository, 'activateUser').mockImplementation(async () => {
        return { ...existingUser, isActive: true };
      });
      const activatedUser = await userService.activateCustomer(1);
      expect(activatedUser.isActive).toBeTruthy();
    });

    it('should throw InternalServerErrorException when activateUser throw error', async () => {
      let activateError: Error;
      vi.spyOn(mockRepository, 'isUserActive').mockImplementation(async () => {
        return false;
      });
      vi.spyOn(mockRepository, 'activateUser').mockImplementation(async () => {
        throw new Error('error');
      });
      try {
        await userService.activateCustomer(1);
      } catch (error) {
        activateError = error;
      }
      expect(activateError).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('deactivateUser', () => {
    it('should throw BadRequestException when user is already deactivated', async () => {
      let deactivateError: Error;
      vi.spyOn(mockRepository, 'isUserActive').mockImplementation(async () => {
        return false;
      });
      try {
        await userService.deactivateCustomer(1);
      } catch (error) {
        deactivateError = error;
      }
      expect(deactivateError).toBeInstanceOf(BadRequestException);
    });
    it('should deactivate user and return it', async () => {
      vi.spyOn(mockRepository, 'isUserActive').mockImplementation(async () => {
        return true;
      });
      vi.spyOn(mockRepository, 'deactivateUser').mockImplementation(
        async () => {
          return { ...existingUser, isActive: false };
        },
      );
      const deactivatedUser = await userService.deactivateCustomer(1);
      expect(deactivatedUser.isActive).toBeFalsy();
      deactivatedUser.isActive = true;
      expect(deactivatedUser).toMatchObject(existingUser);
    });
    it('should throw InternalServerErrorException when deactivateUser throw error', async () => {
      let deactivateError: Error;
      vi.spyOn(mockRepository, 'isUserActive').mockImplementation(async () => {
        return true;
      });
      vi.spyOn(mockRepository, 'deactivateUser').mockImplementation(
        async () => {
          throw new Error('error');
        },
      );
      try {
        await userService.deactivateCustomer(1);
      } catch (error) {
        deactivateError = error;
      }
      expect(deactivateError).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe('filterUser', () => {
    it('should return list of users', async () => {
      vi.spyOn(mockRepository, 'filterUser').mockImplementation(async () => {
        return [existingUser];
      });
      const users = await userService.filterCustomer({
        isActive: true,
        search: '',
      });
      expect(users).toEqual([existingUser]);
    });
    it('should return empty list if no user is found', async () => {
      vi.spyOn(mockRepository, 'filterUser').mockImplementation(async () => {
        return [];
      });
      const users = await userService.filterCustomer({
        isActive: true,
        search: '',
      });
      expect(users).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return user when user is found', async () => {
      vi.spyOn(mockRepository, 'findById').mockImplementation(async () => {
        return existingUser;
      });
      const user = await userService.findById(1);
      expect(user).toEqual(existingUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      let findError: Error;
      vi.spyOn(mockRepository, 'findById').mockImplementation(async () => {
        return null;
      });
      try {
        await userService.findById(1);
      } catch (error) {
        findError = error;
      }
      expect(findError).toBeInstanceOf(NotFoundException);
    });
  });
});
