// socket-server project main.go
package main

import (
	"fmt"
	"net"
	"os"
	"github.com/splode/fname"
)

const (
	SERVER_HOST   = "" // check all ips from all nics
	SERVER_PORT   = "9988"
	SERVER_TYPE   = "tcp"
	LISTENER_PORT = "9989"
)

func main() {
	fmt.Println("Server Running...")
	server, err := net.Listen(SERVER_TYPE, SERVER_HOST+":"+SERVER_PORT)
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}

	listener, err := net.Listen(SERVER_TYPE, SERVER_HOST+":"+LISTENER_PORT)
	if err != nil {
		fmt.Println("Error connecting to  listener:", err.Error())
		os.Exit(1)
	}

	listenerConnection, err := listener.Accept()
	if err != nil {
		fmt.Println("Error accepting Listener:", err.Error())
		os.Exit(1)
	}

	defer server.Close()
	fmt.Println("Listening on " + SERVER_HOST + ":" + SERVER_PORT)
	fmt.Println("Waiting for client...")

	rng := fname.NewGenerator()
	mp := make(map[net.Conn]string)

	for {
		// set new connected socket for the connections
		connection, err := server.Accept()

		// generate random name for the clients
		phrase, err := rng.Generate()
		mp[connection] = fmt.Sprintf(phrase)

		if err != nil {
			fmt.Println("Error accepting: ", err.Error())
			os.Exit(1)
		}

		// remote address is the client address
		fmt.Printf("%v connected with %v remote address \n",
			mp[connection], connection.RemoteAddr())

			_, err = listenerConnection.Write([]byte(fmt.Sprintf("%v connected with %v remote address \n",
											mp[connection], connection.RemoteAddr())))
		go processClient(connection, listenerConnection, mp)
	}
}
func processClient(connection, listenerConnection net.Conn, mp map[net.Conn]string) {
	defer connection.Close()
	defer delete(mp, connection)

	for {
		buffer := make([]byte, 1024)

		// Conn has Read() method to read from connection
		mLen, err := connection.Read(buffer)

		if err != nil {
			if err.Error() == "EOF" {
				fmt.Println("Connection Ended gracefully with " + mp[connection])
				listenerConnection.Write([]byte(fmt.Sprintf("%v left the chat", mp[connection])))
				return
			}
			fmt.Println("Error Occurred : ", err.Error())
			break
		}

		fmt.Printf("%v: %v", mp[connection], string(buffer[:mLen]))

		// to write to the listener connection
		_, err = listenerConnection.Write([]byte(fmt.Sprintf("%v: %v", mp[connection], string(buffer[:mLen]))))
	}
}
