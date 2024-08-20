// socket-client project main.go
package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"strings"
)

const (
	SERVER_HOST = "localhost"
	SERVER_PORT = "9988"
	SERVER_TYPE = "tcp"
)

func main() {
	//establish connection
	connection, err := net.Dial(SERVER_TYPE, SERVER_HOST+":"+SERVER_PORT)
	if err != nil {
		panic(err)
	}
	///send some data from the terminal for now
	reader := bufio.NewReader(os.Stdin)
	for {
		input, _ := reader.ReadString('\n')
		_, err = connection.Write([]byte(input))
		if err != nil {
			fmt.Println("Error writing:", err.Error())
			break
		}
		// buffer := make([]byte, 1024)
		// mLen, err := connection.Read(buffer)
		// if err != nil {
		// 	fmt.Println("Error :", err.Error())
		// }
		fmt.Println("Received")
		if strings.ToLower(input) == "bye\n" {
			break
		}
	}
	defer connection.Close()
}
