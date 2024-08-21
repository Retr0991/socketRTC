// socket-server project main.go
package main

import (
	"fmt"
	"net"
	"os"
)

const (
	SERVER_HOST = ""
	SERVER_PORT = "9988"
	SERVER_TYPE = "tcp"
)

func main() {
	fmt.Println("Server Running...")
	server, err := net.Listen(SERVER_TYPE, SERVER_HOST+":"+SERVER_PORT)
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}
	defer server.Close()
	fmt.Println("Listening on " + SERVER_HOST + ":" + SERVER_PORT)
	fmt.Println("Waiting for client...")
	mp := make(map[net.Conn]string)
	i := 1
	for {
		// set new connected socket for the connections
		connection, err := server.Accept()
		mp[connection] = fmt.Sprintf("Client%v", i)
		i++
		if err != nil {
			fmt.Println("Error accepting: ", err.Error())
			os.Exit(1)
		}

		// remote address is the client address
		fmt.Printf("%v connected with %v remote address \n",
				mp[connection], connection.RemoteAddr())
		go processClient(connection, mp)
	}
}
func processClient(connection net.Conn, mp map[net.Conn]string) {
	defer connection.Close()
	defer delete(mp, connection)

	for {
		buffer := make([]byte, 1024)

		// Conn has Read() method to read from connection
		mLen, err := connection.Read(buffer)

		if err != nil {
			if err.Error() == "EOF" {
				fmt.Println("Connection Ended gracefully with " + mp[connection])
				return
			}
			fmt.Println("Error Occurred : ", err.Error())
			break
		}

		fmt.Printf("%v: %v", mp[connection], string(buffer[:mLen]))

		// to write to the connection for confirmation of message received
		// _, err = connection.Write([]byte("Got message:" + string(buffer[:mLen])))
	}
}
