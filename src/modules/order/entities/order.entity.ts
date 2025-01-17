import { OrderItem } from "@modules/order-item/entity/order-item.entity";

export class Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
}
