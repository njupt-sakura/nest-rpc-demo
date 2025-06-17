import { dirname, join } from 'node:path';
import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const itemProtoPath = join(__dirname, '../proto/item.proto');
const orderProtoPath = join(__dirname, '../proto/order.proto');

const packageDefinition = protoLoader.loadSync(
  [itemProtoPath, orderProtoPath],
  {
    defaults: true,
    keepCase: true,
    oneofs: true,
    enums: String,
    longs: String,
  },
);

const item = loadPackageDefinition(packageDefinition).item;
const order = loadPackageDefinition(packageDefinition).order;

// console.log(item);
// console.log(order);

const itemClient = new item.ItemService(
  'localhost:9001',
  credentials.createInsecure(),
);

const handler = (prefix) => (err, res) =>
  console.log(
    prefix,
    err ? 'err:' + JSON.stringify(err) : 'res: ' + JSON.stringify(res),
  );

itemClient.findOne({ id: 1 }, handler('[itemClient] findOne'));
itemClient.findOneWithOrder(
  { id: 1 },
  handler('[itemClient] findOneWithOrder'),
);
itemClient.findMany({ page: 0, pageSize: 2 }, handler('[itemClient] findMany'));

const orderClient = new order.OrderService(
  'localhost:9002',
  credentials.createInsecure(),
);

orderClient.findOne({ id: 1 }, handler('[orderClient] findOne'));
orderClient.findOneWithItem(
  { id: 1 },
  handler('[orderClient] findOneWithItem'),
);
