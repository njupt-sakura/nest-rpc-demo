import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { ORDER_PACKAGE_NAME } from './codegen/order';
import { ORDER_CLIENT_NAME } from './const';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDER_CLIENT_NAME,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:9002',
          package: ORDER_PACKAGE_NAME, // order
          protoPath: join(__dirname, '../../proto/order.proto'),
        },
      },
    ]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
})
export class AppModule {}
