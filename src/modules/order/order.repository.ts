import { PaginationResult } from '@common/pagination';
import { FilterOrderDto } from './dto/get-order.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { Order } from './entities/order.entity';

export abstract class OrderRepository {
  abstract placeOrder(customerId: number, dto: PlaceOrderDto): Promise<Order>;
  abstract getOrdersByCustomerId(
    customerId: number,
    filter: FilterOrderDto,
  ): Promise<PaginationResult<Order>>;
}
