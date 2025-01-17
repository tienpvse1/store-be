import { Test } from '@nestjs/testing';
import { TokenSigner } from '@common/signer/signer';
import { vi } from 'vitest';
import { AuthGuard } from '../auth/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockAuthGuard = {
  canActivate: vi.fn(),
};

const mockUserService = {
  updateUserProfile: vi.fn(),
  bootstrapAdmin: vi.fn(),
  createCustomer: vi.fn(),
  activateCustomer: vi.fn(),
  deactivateCustomer: vi.fn(),
  filterCustomer: vi.fn(),
  findById: vi.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [AuthGuard],
    })
      .overrideProvider(AuthGuard)
      .useValue(mockAuthGuard)
      .useMocker((token) => {
        if (token === UserService) {
          return mockUserService;
        }
        if (token === TokenSigner) {
          return {};
        }
      })
      .compile();
    controller = module.get(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateUserProfile', () => {
    it('should call updateUserProfile', async () => {
      const id = 1;
      const dto = {};
      await controller.updateUserProfile(id, dto);
      expect(mockUserService.updateUserProfile).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('createAdmin', () => {
    it('should call createAdmin', async () => {
      vi.spyOn(mockUserService, 'bootstrapAdmin');
      const dto: CreateUserDto = {
        name: 'admin',
        email: 'admin@example.com',
        password: 'p@ssw0rd123',
      };
      await controller.createAdmin(dto);
      expect(mockUserService.bootstrapAdmin).toHaveBeenCalledWith(dto);
    });
  });

  describe('createCustomer', () => {
    it('should call createCustomer', async () => {
      vi.spyOn(mockUserService, 'createCustomer');
      const dto: CreateUserDto = {
        name: 'customer',
        email: 'customer@example.com',
        password: 'p@ssw0rd123',
      };
      await controller.createCustomer(dto);
      expect(mockUserService.createCustomer).toHaveBeenCalledWith(dto);
    });
  });

  describe('activateUser', () => {
    it('should call activateUser', async () => {
      vi.spyOn(mockUserService, 'activateCustomer');
      const dto = { id: 1 };
      await controller.activateCustomer(dto);
      expect(mockUserService.activateCustomer).toHaveBeenCalledWith(dto.id);
    });
  });

  describe('deactivateUser', () => {
    it('should call deactivateUser', async () => {
      vi.spyOn(mockUserService, 'deactivateCustomer');
      const dto = { id: 1 };
      await controller.deactivateCustomer(dto);
      expect(mockUserService.deactivateCustomer).toHaveBeenCalledWith(dto.id);
    });
  });

  describe('filterUser', () => {
    it('should call filterUser', async () => {
      vi.spyOn(mockUserService, 'filterCustomer');
      const filter = { isActive: true, search: '' };
      await controller.searchCustomer(filter);
      expect(mockUserService.filterCustomer).toHaveBeenCalledWith(filter);
    });
  });

  describe('findById', () => {
    it('should call findById', async () => {
      vi.spyOn(mockUserService, 'findById');
      const id = 1;
      await controller.viewProfile(id);
      expect(mockUserService.findById).toHaveBeenCalledWith(id);
    });
  });
});
