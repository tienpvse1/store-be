import { NotificationEvent } from '@modules/notification/event';
import { NotificationService } from '@modules/notification/notification.service';
import { ProductService } from '@modules/product/product.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilterOrderDto } from './dto/get-order.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly repository: OrderRepository,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService,
  ) {}

  private async validateOrderItems(items: PlaceOrderDto['items']) {
    if (items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new BadRequestException('Item quantity must be greater than 0');
      }
      const isOrderExists = await this.productService.isProductExists(
        item.productId,
      );
      if (!isOrderExists) {
        throw new BadRequestException(
          `Product with id ${item.productId} not found`,
        );
      }
    }
  }

  async placeOrder(customerId: number, dto: PlaceOrderDto) {
    await this.validateOrderItems(dto.items);
    try {
      const createdOrder = await this.repository.placeOrder(customerId, dto);
      this.notificationService.send(
        NotificationEvent.OrderPlaced,
        customerId,
        `Order ${createdOrder.id} has been placed`,
      );
      return createdOrder;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getOwnOrders(customerId: number, filter: FilterOrderDto) {
    return this.repository.getOrdersByCustomerId(customerId, filter);
  }
}
