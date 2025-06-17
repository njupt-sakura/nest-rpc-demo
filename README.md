# nest-rpc-demo

## Step 1: item-server

```bash
pwd # /path/to/nest-rpc-demo

pnpm i -g @nestjs/cli
nest new item-server
mkdir ./client ./order-server

brew install protobuf # MacOS

cd ./client
pnpm init # "type": "module"

cd ../order-server
go mod init com.github.njupt-sakura/nest-rpc-demo/order-server

cd ../item-server
pnpm add @grpc/grpc-js @grpc/proto-loader
pnpm add ts-proto -D

mkdir ./src/codegen
protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
       --ts_proto_out=./src/codegen                     \
       --ts_proto_opt=nestJs=true                       \
       --proto_path=../proto                            \
       common.proto order.proto item.proto
```

## Step2: order-server

```bash
pwd # /path/to/nest-rpc-demo

cd ./order-server
brew install protoc-gen-go-grpc # MacOS
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

mkdir ./codegen
protoc --go_out=./codegen                  \
       --go_opt=paths=source_relative      \
       --proto_path=../proto               \
       --go-grpc_out=./codegen             \
       --go-grpc_opt=paths=source_relative \
       common.proto order.proto item.proto

go mod tidy
```

## Step 3: client

```bash
pwd # /path/to/nest-rpc-demo

cd ./client
# "type": "module"
pnpm add @types/node ts-proto -D
pnpm add @grpc/grpc-js @grpc/proto-loader
```
