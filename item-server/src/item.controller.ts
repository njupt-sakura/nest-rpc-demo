import { Controller } from '@nestjs/common';
import { ItemService } from './item.service';
import {
  Item,
  ItemById,
  ItemList,
  ItemServiceController,
  ItemServiceControllerMethods,
  ItemWithOrderInfo,
} from './codegen/item';
import { Pagination } from './codegen/common';
import { lastValueFrom } from 'rxjs';
import { Order } from './codegen/order';

const items = [
  { id: 1, name: '161043261', url: 'https://github.com/161043261' },
  { id: 2, name: 'tianchenghang', url: 'https://github.com/tianchenghang' },
];

@Controller('item' /** prefix */)
@ItemServiceControllerMethods()
export class ItemController implements ItemServiceController {
  constructor(private readonly itemService: ItemService) {}

  findOne(request: ItemById): Item {
    const item = items.find((item) => item.id === request.id);
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  findMany(request: Pagination): Promise<ItemList> {
    const { page, pageSize } = request;
    if (page * pageSize > items.length) {
      throw new Error('Out of range');
    }
    return new Promise((resolve) => {
      setTimeout(
        () => resolve({ list: items.slice(page * pageSize, pageSize) }),
        3000, // 3s
      );
    });
  }

  async findOneWithOrder(request: ItemById): Promise<ItemWithOrderInfo> {
    const order = await lastValueFrom<Order>(
      this.itemService.orderServiceClient.findOne({ id: request.id }),
    );

    const item = items.find((item) => item.id === request.id);
    if (!item || !order) {
      throw new Error('Item or order not found');
    }
    return { ...item, order };
  }
}
