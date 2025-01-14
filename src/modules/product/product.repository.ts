import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

export abstract class ProductRepository {
  abstract createProduct(
    adminId: number,
    product: CreateProductDto,
  ): Promise<Product>;
  abstract updateProduct(
    adminId: number,
    id: number,
    product: UpdateProductDto,
  ): Promise<Product>;
  abstract deactivateProduct(adminId: number, id: number): Promise<Product>;
  abstract activateProduct(adminId: number, id: number): Promise<Product>;
  abstract getProductById(id: number): Promise<Product>;
  abstract getProducts(
    isAdmin: boolean,
    filter: FilterProductDto,
  ): Promise<Product[]>;
}
