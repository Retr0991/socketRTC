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
	SERVER_HOST = "localhost" // specify the address of the server
	SERVER_PORT = "9988"
	SERVER_TYPE = "tcp"
)

func getMessages(connection net.Conn) {
	for {
		buffer := make([]byte, 1024)
		mLen, err := connection.Read(buffer)

		if err != nil {
			fmt.Println("Error reading:", err.Error())
			return
		}

		fmt.Print(string(buffer[:mLen]))
	}
}

func main() {
	//establish connection
	connection, err := net.Dial(SERVER_TYPE, SERVER_HOST+":"+SERVER_PORT)
	if err != nil {
		panic(err)
	}
	// close the connection just before return
	defer connection.Close()

	go getMessages(connection)

	///send some data from the terminal for now
	reader := bufio.NewReader(os.Stdin)
	for {
		input, _ := reader.ReadString('\n')
		_, err = connection.Write([]byte(input))
		if err != nil {
			fmt.Println("Error writing:", err.Error())
			return
		}

		// exit
		if strings.ToLower(input) == "bye\n" {
			fmt.Println("Well, that ended well")
			return
		}
	}
}
