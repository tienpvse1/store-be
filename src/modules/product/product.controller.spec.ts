import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/common/roles';
import { vi } from 'vitest';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
const mockProductService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  deactivateProduct: vi.fn(),
  activateProduct: vi.fn(),
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
    })
      .useMocker((token) => {
        if (token === ProductService) {
          return mockProductService;
        }
      })
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const adminId = 1;
      const createProductDto = {
        name: 'product',
        price: 100,
      };
      const product = {
        id: 1,
        ...createProductDto,
      };
      mockProductService.create.mockResolvedValue(product);
      const result = await controller.create(adminId, createProductDto);
      expect(result).toMatchObject(product);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const filter = {};
      const products = [{ id: 1, name: 'product', price: 100 }];
      mockProductService.findAll.mockResolvedValue(products);
      const result = await controller.findAll(filter, [Role.Admin]);
      expect(result).toMatchObject(products);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const productId = 1;
      const product = { id: 1, name: 'product', price: 100 };
      mockProductService.findOne.mockResolvedValue(product);
      const result = await controller.findOne(productId);
      expect(result).toMatchObject(product);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const adminId = 1;
      const id = 1;
      const updateProductDto = { name: 'product', price: 100 };
      const product = { id: 1, ...updateProductDto };
      mockProductService.update.mockResolvedValue(product);
      const result = await controller.update(adminId, id, updateProductDto);
      expect(result).toMatchObject(product);
    });
  });

  describe('deactivateProduct', () => {
    it('should deactivate a product', async () => {
      const adminId = 1;
      const id = 1;
      const product = { id: 1, name: 'product', price: 100, isActive: true };
      mockProductService.findOne.mockResolvedValue(product);
      mockProductService.deactivateProduct.mockResolvedValue(product);
      const result = await controller.deactivateProduct(adminId, id);
      expect(result).toMatchObject(product);
    });
  });

  describe('activateProduct', () => {
    it('should activate a product', async () => {
      const adminId = 1;
      const id = 1;
      const product = { id: 1, name: 'product', price: 100, isActive: false };
      mockProductService.findOne.mockResolvedValue(product);
      mockProductService.activateProduct.mockResolvedValue(product);
      const result = await controller.activateProduct(adminId, id);
      expect(result).toMatchObject(product);
    });
  });
});
