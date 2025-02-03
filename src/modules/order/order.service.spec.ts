import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { NotificationService } from '@modules/notification/notification.service';
import { mockNotificationService } from '@testing/mocker';
import { ProductService } from '@modules/product/product.service';

const mockOrderRepository = {};
const mockProductService = {};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
    })
      .useMocker((token) => {
        if (token == OrderRepository) return mockOrderRepository;
        if (token == NotificationService) return mockNotificationService;
        if (token == ProductService) return mockProductService;
      })
      .compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
