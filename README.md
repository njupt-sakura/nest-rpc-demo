# nest-rpc-demo

```bash
pnpm add @grpc/grpc-js @grpc/proto-loader
pnpm add ts-proto -D

brew install protobuf

pwd # /path/to/nest-rpc-demo

mkdir item-server && cd item-server

protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
       --ts_proto_out=./src/codegen                     \
       --ts_proto_opt=nestJs=true                       \
       --proto_path=../proto item.proto
```
