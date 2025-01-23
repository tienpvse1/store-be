import { Generator } from '@common/code-generator';
import { InjectKysely, KyselyInstance } from '@common/db';
import { OrderStatus } from '@common/order-status';
import { PaymentMethod } from '@common/payment-method';
import { Injectable } from '@nestjs/common';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { FilterOrderDto } from '../dto/get-order.dto';
import { PlaceOrderDto } from '../dto/place-order.dto';
import { Order } from '../entities/order.entity';
import { OrderRepository } from '../order.repository';

@Injectable()
export class PostgresOrderRepository extends OrderRepository {
  constructor(
    @InjectKysely private readonly instance: KyselyInstance,
    private readonly codeGenerator: Generator,
  ) {
    super();
  }

  placeOrder(customerId: number, dto: PlaceOrderDto) {
    const order = this.instance.transaction().execute(async (trx) => {
      const now = new Date();
      const code = this.codeGenerator.generateCode('OD');
      const order = await trx
        .insertInto('order')
        .values({
          id: code,
          createdAt: now,
          createdById: customerId,
          lastUpdatedAt: now,
          paymentMethod: dto.paymentMethod || PaymentMethod.COD,
          orderStatus: OrderStatus.New,
          paid: false,
          lastUpdatedById: customerId,
          customerAddress: dto.customerAddress,
          customerEmail: dto.customerEmail,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
        })
        .returning([
          'order.id',
          'order.createdAt',
          'order.lastUpdatedAt',
          'order.paymentMethod',
          'order.orderStatus',
          'order.createdById',
          'order.lastUpdatedById',
          'order.paid',
          'order.customerAddress',
          'order.customerEmail',
          'order.customerName',
          'order.customerPhone',
        ])
        .executeTakeFirst();
      const orderItems = await trx
        .insertInto('orderItem')
        .values(
          dto.items.map((item) => ({
            id: this.codeGenerator.generateCode('OI'),
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
          })),
        )
        .returning([
          'orderItem.id',
          'orderItem.orderId',
          'orderItem.productId',
          'orderItem.quantity',
        ])
        .execute();
      return {
        ...order,
        paymentMethod: order.paymentMethod as PaymentMethod,
        orderStatus: order.orderStatus as OrderStatus,
        orderItems: orderItems,
      };
    });
    return order;
  }

  async getOrdersByCustomerId(
    customerId: number,
    filter: FilterOrderDto,
  ): Promise<Order[]> {
    let query = this.instance
      .selectFrom('order')
      .leftJoin('orderItem', 'orderItem.orderId', 'order.id')
      .where('order.createdById', '=', customerId)
      .groupBy('order.id');

    if (filter.search) {
      query = query.where(function (eb) {
        return eb.or([
          eb('order.customerAddress', 'ilike', `%${filter.search}%`),
          eb('order.customerPhone', 'ilike', `%${filter.search}%`),
          eb('order.customerEmail', 'ilike', `%${filter.search}%`),
          eb('order.id', 'ilike', `%${filter.search}%`),
        ]);
      });
    }
    const count = await query
      .select((eb) => eb.fn.count('order.id').as('count'))
      .executeTakeFirst();

    return query
      .select((eb) => [
        'order.id',
        'order.id',
        'order.createdAt',
        'order.lastUpdatedAt',
        eb
          .ref('order.paymentMethod')
          .$castTo<PaymentMethod>()
          .as('paymentMethod'),
        eb.ref('order.orderStatus').$castTo<OrderStatus>().as('orderStatus'),
        'order.createdById',
        'order.lastUpdatedById',
        'order.paid',
        'order.customerAddress',
        'order.customerEmail',
        'order.customerName',
        'order.customerPhone',
        eb.fn
          .jsonAgg(
            jsonBuildObject({
              id: eb.ref('orderItem.id'),
              productId: eb.ref('orderItem.productId'),
              quantity: eb.ref('orderItem.quantity'),
              orderId: eb.ref('orderItem.orderId'),
            }),
          )
          .as('orderItems'),
      ])
      .limit(filter.limit || 10)
      .offset(filter.offset || 0)
      .execute();
  }
}
