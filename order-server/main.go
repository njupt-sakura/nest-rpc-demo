package main

import (
	"context"
	"errors"
	"log"
	"net"

	pb "com.github.njupt-sakura/nest-rpc-demo/order-server/codegen"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var itemClient pb.ItemServiceClient

type Server struct {
	pb.UnimplementedOrderServiceServer
}

var orders = []pb.Order{
	{Id: 1, Price: 1.11},
	{Id: 2, Price: 2.22},
}

func (s *Server) FindOne(ctx context.Context, orderById *pb.OrderById) (*pb.Order, error) {
	for i := range orders {
		if orders[i].Id == orderById.Id {
			return &orders[i], nil
		}
	}
	return nil, errors.New("Order not found")
}

func (s *Server) FindOneWithItem(ctx context.Context, request *pb.OrderById) (*pb.OrderWithItemInfo, error) {

	// Call item RPC service
	item, err := itemClient.FindOne(ctx, &pb.ItemById{Id: request.Id})
	if err != nil {
		log.Println(err)
		return nil, errors.New("Item not found")
	}

	var order *pb.Order
	for i := range orders {
		if orders[i].Id == request.Id {
			order = &orders[i]
			break
		}
	}

	if order == nil {
		return nil, errors.New("Order not found")
	}

	return &pb.OrderWithItemInfo{
		Id:    order.Id,
		Price: order.Price,
		Item: &pb.OrderWithItemInfo_Item{
			Id:   item.Id,
			Name: item.Name,
		},
	}, nil
}

func main() {
	defer func() {
		if err := recover(); err != nil {
			log.Println(err)
		}
	}()

	itemConn, err := grpc.NewClient("localhost:9001", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	defer itemConn.Close()

	itemClient = pb.NewItemServiceClient(itemConn)

	server := grpc.NewServer()
	defer server.Stop()
	pb.RegisterOrderServiceServer(server, &Server{})

	listener, err := net.Listen("tcp", ":9002")
	if err != nil {
		panic(err)
	}
	server.Serve(listener)
}
