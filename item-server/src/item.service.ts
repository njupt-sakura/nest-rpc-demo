import { Inject, Injectable } from '@nestjs/common';
import { ORDER_SERVICE_NAME, OrderServiceClient } from './codegen/order';
import { ClientGrpc } from '@nestjs/microservices';
import { ORDER_CLIENT_NAME } from './const';

@Injectable()
export class ItemService {
  public orderServiceClient!: OrderServiceClient;
  constructor(
    @Inject(ORDER_CLIENT_NAME /** token */)
    private readonly orderClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderServiceClient = this.orderClient.getService<OrderServiceClient>(
      ORDER_SERVICE_NAME /** OrderService */,
    );
  }
}
