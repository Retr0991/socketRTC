package main

import (
	"fmt"
	"net"
)

const (
	SERVER_IP            = "localhost"
	SERVER_OUTBOUND_PORT = "9989"
	SERVER_TYPE          = "tcp"
)

func GetChatDetails() {
	server, err := net.Dial(SERVER_TYPE, SERVER_IP+":"+SERVER_OUTBOUND_PORT)
	defer server.Close()

	if err != nil {
		fmt.Println("Error Encountered: ", err.Error())
		return
	}


	for {
		buffer := make([]byte, 1024)
		mLen, err := server.Read(buffer)
		if err != nil {
			fmt.Println("Error Occurred : ", err.Error())
		} else {
			fmt.Println(string(buffer[:mLen]))
		}
	}

}
