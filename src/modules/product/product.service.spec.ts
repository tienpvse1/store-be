import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { expect, vi } from 'vitest';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

const mockProductRepository = {
  getProducts: vi.fn(),
  getProductById: vi.fn(),
  updateProduct: vi.fn(),
  createProduct: vi.fn(),

  deactivateProduct: vi.fn(),
  activateProduct: vi.fn(),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    })
      .useMocker((token) => {
        if (token == ProductRepository) {
          return mockProductRepository;
        }
      })
      .compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    const createProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      quantity: 10,
      price: 100,
    };

    it('should create a product', async () => {
      vi.spyOn(mockProductRepository, 'createProduct').mockResolvedValue({
        id: 1,
        ...createProductDto,
      });

      const result = await service.create(1, createProductDto);
      expect(result).toMatchObject({ id: 1, ...createProductDto });
      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(
        1,
        createProductDto,
      );
    });

    it('should throw an internal server exception if product creation fails', async () => {
      vi.spyOn(mockProductRepository, 'createProduct').mockRejectedValue(
        new Error('Internal server error'),
      );
      await expect(service.create(1, createProductDto)).rejects.toThrow(
        'Internal server error',
      );
      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(
        1,
        createProductDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return the product list', async () => {
      vi.spyOn(mockProductRepository, 'getProducts').mockResolvedValue([
        { id: 1, name: 'Test Product 1' },
        { id: 2, name: 'Test Product 2' },
      ]);
      const result = await service.findAll(true, {});
      expect(result).toMatchObject([
        { id: 1, name: 'Test Product 1' },
        { id: 2, name: 'Test Product 2' },
      ]);
      expect(mockProductRepository.getProducts).toHaveBeenCalledWith(true, {});
    });

    it('should throw an internal server exception if fetching products fails', async () => {
      vi.spyOn(mockProductRepository, 'getProducts').mockRejectedValue(
        new Error('Internal server error'),
      );
      await expect(service.findAll(true, {})).rejects.toThrow(
        'Internal server error',
      );
      expect(mockProductRepository.getProducts).toHaveBeenCalledWith(true, {});
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue({
        id: 1,
        name: 'Test Product',
      });
      const result = await service.findOne(1);
      expect(result).toMatchObject({ id: 1, name: 'Test Product' });
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(1);
    });

    it("should throw a not found exception if product doesn't exist", async () => {
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(
        'Product with id 1 not found',
      );
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(1);
    });

    it('should throw an internal server exception if fetching product fails', async () => {
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockProductRepository.getProductById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it("should update a product's details", async () => {
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue({
        id: 1,
        name: 'Test Product',
      });
      vi.spyOn(mockProductRepository, 'updateProduct').mockResolvedValue({
        id: 1,
        name: 'Test Product',
      });
      const updateProductDto = {
        name: 'Test Product',
      };
      const result = await service.update(1, 1, updateProductDto);
      expect(result).toMatchObject({ id: 1, ...updateProductDto });
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(
        1,
        1,
        updateProductDto,
      );
    });

    it("should throw a not found exception if product doesn't exist", async () => {
      const updateDto = { name: 'name' };
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue(null);
      await expect(service.update(1, 1, updateDto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockProductRepository.updateProduct).not.toHaveBeenCalled();
    });
  });

  describe('deactivateProduct', () => {
    it('should deactivate a product', async () => {
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue({
        id: 1,
        name: 'Test Product',
        isActive: true,
      });
      vi.spyOn(mockProductRepository, 'deactivateProduct').mockResolvedValue({
        id: 1,
        name: 'Test Product',
        isActive: false,
      });
      const result = await service.deactivateProduct(1, 1);
      expect(result).toMatchObject({
        id: 1,
        name: 'Test Product',
        isActive: false,
      });
      expect(mockProductRepository.deactivateProduct).toHaveBeenCalledWith(
        1,
        1,
      );
    });

    it('should throws bad request exception when product already deactivated', async () => {
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue({
        id: 1,
        name: 'Test Product',
        isActive: false,
      });
      await expect(service.deactivateProduct(1, 1)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('activateProduct', () => {

    it('should activate a product', async () => {
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue({
        id: 1,
        name: 'Test Product',
        isActive: false,
      });
      vi.spyOn(mockProductRepository, 'activateProduct').mockResolvedValue({
        id: 1,
        name: 'Test Product',
        isActive: true,
      });
      const result = await service.activateProduct(1, 1);
      expect(result).toMatchObject({
        id: 1,
        name: 'Test Product',
        isActive: true,
      });
      expect(mockProductRepository.activateProduct).toHaveBeenCalledWith(1, 1);
    });

    it('should throws bad request exception when product already activated', async () => {
      vi.spyOn(mockProductRepository, 'getProductById').mockResolvedValue({
        id: 1,
        name: 'Test Product',
        isActive: true,
      });
      await expect(service.activateProduct(1, 1)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
