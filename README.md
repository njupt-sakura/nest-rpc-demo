# nest-rpc-demo

```bash
pnpm i -g @nestjs/cli
nest new item-server
mkdir ./client ./order-

cd ./order-server
go mod init com.github.njupt-sakura/nest-rpc-demo/order-server

cd ../item-server
brew install protobuf

pnpm add @grpc/grpc-js @grpc/proto-loader
pnpm add ts-proto -D

mkdir ./src/codegen
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
       --ts_proto_out=./src/codegen                     \
       --ts_proto_opt=nestJs=true                       \
       --proto_path=../proto item.proto
```
