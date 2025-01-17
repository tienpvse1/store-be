import { PlaceOrderDto } from "./dto/place-order.dto";
import { Order } from "./entities/order.entity";

export abstract class OrderRepository {
  abstract placeOrder(dto: PlaceOrderDto): Promise<Order>
}
