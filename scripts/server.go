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
		// local address is the server address
		// remote address is the client address
		fmt.Printf("client connected \n%v is the local address \n%v is the remote address \n\n", connection.LocalAddr(), connection.RemoteAddr())
		go processClient(connection, mp)
	}
}
func processClient(connection net.Conn, mp map[net.Conn]string) {
	for {
		buffer := make([]byte, 1024)

		// Conn has Read() method to read from connection
		mLen, err := connection.Read(buffer)
		if err != nil {
			fmt.Println("Error reading:", err.Error())
		}
		fmt.Printf("%v: %v", mp[connection], string(buffer[:mLen]))

		// to write to the connection
		_, err = connection.Write([]byte("Thanks! Got your message:" + string(buffer[:mLen])))
	}
	// connection.Close()
}
