import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private repository: ProductRepository) {}

  create(adminId: number, createProductDto: CreateProductDto) {
    try {
      const product = this.repository.createProduct(adminId, createProductDto);
      return product;
    } catch (error) {
      throw new InternalServerErrorException('Unable to create product');
    }
  }

  findAll(isAdmin: boolean, filter: FilterProductDto) {
    try {
      return this.repository.getProducts(isAdmin, filter);
    } catch (error) {
      throw new InternalServerErrorException('Unable to fetch products');
    }
  }

  async findOne(productId: number) {
    try {
      const product = await this.repository.getProductById(productId);
      if (!product)
        throw new NotFoundException(`Product with id ${productId} not found`);
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Unable to fetch product');
    }
  }

  async update(
    adminId: number,
    id: number,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    try {
      const product = await this.repository.updateProduct(
        adminId,
        id,
        updateProductDto,
      );
      return product;
    } catch (error) {
      throw new InternalServerErrorException('Unable to update product');
    }
  }

  async deactivateProduct(adminId: number, id: number) {
    const product = await this.repository.getProductById(id);
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }
    if (!product.isActive) {
      throw new BadRequestException('Product already deactivated');
    }
    try {
      return this.repository.deactivateProduct(adminId, id);
    } catch (error) {
      throw new InternalServerErrorException('Unable to deactivate product');
    }
  }

  async activateProduct(adminId: number, id: number) {
    const product = await this.repository.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.isActive) {
      throw new BadRequestException('Product already activated');
    }
    try {
      return this.repository.activateProduct(adminId, id);
    } catch (error) {
      throw new InternalServerErrorException('Unable to deactivate product');
    }
  }
}
