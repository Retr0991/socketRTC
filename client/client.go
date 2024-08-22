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
	SERVER_HOST = "tempappanme-fd88e279368e.herokuapp.com"
	SERVER_PORT = "9988"
	SERVER_TYPE = "tcp"
)

func main() {
	//establish connection
	connection, err := net.Dial(SERVER_TYPE, SERVER_HOST+":"+SERVER_PORT)
	if err != nil {
		panic(err)
	}
	// close the connection just before return
	defer connection.Close()


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
			break
		}
	}

	fmt.Println("Well, that ended well")
}
