import { UserId } from '@decorators/user';
import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ErrorResponse } from 'error/error-response';
import { FilterOrderDto } from './dto/get-order.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('order')
@ApiBearerAuth('Authorization')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place-order')
  @ApiOperation({
    summary: 'Place an order',
    description:
      'place an order, product id must exists and quantity of each item must greater than 0',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse(HttpStatus.BAD_REQUEST),
    description: 'quantity is equal or little than 0 or product id not exists',
  })
  @ApiCreatedResponse({ type: Order, description: 'Placed order' })
  create(@Body() dto: PlaceOrderDto, @UserId() userId: number) {
    return this.orderService.placeOrder(userId, dto);
  }

  @Get('own-orders')
  @ApiOkResponse({ type: [Order], description: 'list of orders' })
  @ApiOperation({
    summary: 'Get own orders',
    description:
      'Get placed order of current logged in customer, customer must be logged in',
  })
  @ApiInternalServerErrorResponse({
    type: ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR),
    description: 'Internal server error',
  })
  getOwnOrders(@UserId() userId: number, @Query() filter: FilterOrderDto) {
    return this.orderService.getOwnOrders(userId, filter);
  }
}
