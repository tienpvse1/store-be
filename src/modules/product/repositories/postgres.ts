import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { InjectKysely, KyselyInstance } from 'src/common/db';
import { CreateProductDto } from '../dto/create-product.dto';
import { FilterProductDto } from '../dto/filter-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../product.repository';

@Injectable()
export class PostgresProductRepository extends ProductRepository {
  constructor(@InjectKysely private instance: KyselyInstance) {
    super();
  }
  getProducts(isAdmin: boolean, filter: FilterProductDto): Promise<Product[]> {
    let query = this.instance
      .selectFrom('product')
      .leftJoin('productCategory', 'productCategory.productId', 'product.id')
      .select((eb) => [
        'product.id',
        'product.name',
        'product.description',
        'product.price',
        'product.quantity',
        'product.isActive',
        'product.createdById',
        'product.updatedById',
        eb.fn
          .coalesce(
            eb.fn
              .jsonAgg(eb.ref('productCategory.categoryName'))
              .filterWhere('productCategory.categoryName', 'is not', null),
            sql`'[]'::json`,
          )
          .$castTo<string[]>()
          .as('categories'),
      ]);
    if (filter.name) {
      query = query.where('product.name', 'ilike', `%${filter.name}%`);
    }
    if (filter.priceRange) {
      query = query
        .where('product.price', '>=', filter.priceRange[0].toString())
        .where('product.price', '<=', filter.priceRange[1].toString());
    }
    if (!isAdmin) {
      query = query.where('product.isActive', '=', true);
    }
    return query.groupBy('product.id').execute();
  }

  getProductById(id: number): Promise<Product> {
    return this.instance
      .selectFrom('product')
      .where('id', '=', id)
      .leftJoin('productCategory', 'productCategory.productId', 'product.id')
      .select((eb) => [
        'product.id',
        'product.name',
        'product.description',
        'product.price',
        'product.quantity',
        'product.isActive',
        'product.createdById',
        'product.updatedById',
        eb.fn
          .coalesce(
            eb.fn
              .jsonAgg(eb.ref('productCategory.categoryName'))
              .filterWhere('productCategory.categoryName', 'is not', null),
            sql`'[]'::json`,
          )
          .$castTo<string[]>()
          .as('categories'),
      ])
      .groupBy('product.id')
      .executeTakeFirst();
  }

  async deactivateProduct(adminId: number, id: number) {
    const deactivatedProduct = await this.instance
      .transaction()
      .execute(async (trx) => {
        const deactivatedProduct = await trx
          .updateTable('product')
          .set('isActive', false)
          .set('updatedById', adminId)
          .where('id', '=', id)
          .returning('id')
          .executeTakeFirst();
        return trx
          .selectFrom('product')
          .leftJoin(
            'productCategory',
            'productCategory.productId',
            'product.id',
          )
          .select((eb) => [
            'product.id',
            'product.name',
            'product.description',
            'product.price',
            'product.quantity',
            'product.isActive',
            'product.createdById',
            'product.updatedById',
            eb.fn
              .coalesce(
                eb.fn
                  .jsonAgg(eb.ref('productCategory.categoryName'))
                  .filterWhere('productCategory.categoryName', 'is not', null),
                sql`'[]'::json`,
              )
              .$castTo<string[]>()
              .as('categories'),
          ])
          .where('product.id', '=', deactivatedProduct.id)
          .groupBy('product.id')
          .executeTakeFirst();
      });
    return deactivatedProduct;
  }

  activateProduct(adminId: number, id: number) {
    return this.instance.transaction().execute(async (trx) => {
      const updatedProduct = await trx
        .updateTable('product')
        .set('isActive', true)
        .set('updatedById', adminId)
        .where('id', '=', id)
        .returning('id')
        .executeTakeFirst();
      return trx
        .selectFrom('product')
        .leftJoin('productCategory', 'productCategory.productId', 'product.id')
        .select((eb) => [
          'product.id',
          'product.name',
          'product.description',
          'product.price',
          'product.quantity',
          'product.isActive',
          'product.createdById',
          'product.updatedById',
          eb.fn
            .coalesce(
              eb.fn
                .jsonAgg(eb.ref('productCategory.categoryName'))
                .filterWhere('productCategory.categoryName', 'is not', null),
              sql`'[]'::json`,
            )
            .$castTo<string[]>()
            .as('categories'),
        ])
        .groupBy('product.id')
        .where('product.id', '=', updatedProduct.id)
        .executeTakeFirst();
    });
  }

  updateProduct(
    adminId: number,
    id: number,
    product: UpdateProductDto,
  ): Promise<Product> {
    return this.instance.transaction().execute(async (trx) => {
      const updatedProduct = await trx
        .updateTable('product')
        .set({
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          updatedById: adminId,
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
      return trx
        .selectFrom('product')
        .leftJoin('productCategory', 'productCategory.productId', 'product.id')
        .select((eb) => [
          'product.id',
          'product.name',
          'product.description',
          'product.price',
          'product.quantity',
          'product.isActive',
          'product.createdById',
          'product.updatedById',
          eb.fn
            .coalesce(
              eb.fn
                .jsonAgg(eb.ref('productCategory.categoryName'))
                .filterWhere('productCategory.categoryName', 'is not', null),
              sql`'[]'::json`,
            )
            .$castTo<string[]>()
            .as('categories'),
        ])
        .groupBy('product.id')
        .where('product.id', '=', updatedProduct.id)
        .executeTakeFirst();
    });
  }

  async createProduct(adminId: number, dto: CreateProductDto) {
    const createdProduct = await this.instance
      .insertInto('product')
      .values({
        name: dto.name,
        price: dto.price,
        description: dto.description || '',
        quantity: dto.quantity || 0,
        createdById: adminId,
        updatedById: adminId,
      })
      .returning('id')
      .executeTakeFirst();
    return this.instance
      .selectFrom('product')
      .leftJoin('productCategory', 'productCategory.productId', 'product.id')
      .select((eb) => [
        'product.id',
        'product.name',
        'product.description',
        'product.price',
        'product.quantity',
        'product.isActive',
        'product.createdById',
        'product.updatedById',
        eb.fn
          .coalesce(
            eb.fn
              .jsonAgg(eb.ref('productCategory.categoryName'))
              .filterWhere('productCategory.categoryName', 'is not', null),
            sql`'[]'::json`,
          )
          .$castTo<string[]>()
          .as('categories'),
      ])
      .where('product.id', '=', createdProduct.id)
      .groupBy('product.id')
      .executeTakeFirst();
  }
}
