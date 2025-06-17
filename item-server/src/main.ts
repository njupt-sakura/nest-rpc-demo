import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { ITEM_PACKAGE_NAME } from './codegen/item';
import { join } from 'node:path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<GrpcOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: ITEM_PACKAGE_NAME,
      protoPath: join(__dirname, '../../proto/item.proto'),
      url: 'localhost:9001',
    },
  });
  await app.listen();
}

bootstrap();
