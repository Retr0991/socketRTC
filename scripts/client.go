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
	SERVER_HOST = "192.168.87.167"
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
	flag := true
	for flag {
		input, _ := reader.ReadString('\n')
		_, err = connection.Write([]byte(input))
		buffer := make([]byte, 1024)
		mLen, err := connection.Read(buffer)
		if err != nil {
			fmt.Println("Error reading:", err.Error())
		}
		fmt.Println("Received: ", string(buffer[:mLen]))
		if strings.ToLower(input) == "bye" {
			flag = false
		}
	}
	defer connection.Close()
}
