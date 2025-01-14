import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { PostgresProductRepository } from './repositories/postgres';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    { provide: ProductRepository, useClass: PostgresProductRepository },
  ],
})
export class ProductModule {}
