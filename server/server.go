package main

import (
	"fmt"
	"net"
	"os"

	"github.com/splode/fname"
)

const (
	SERVER_HOST  = ""     // check all ips
	SERVER_PORT  = "9988" // for the client connection
	SERVER_TYPE  = "tcp"
	BACKEND_PORT = "9989" // for the backend connection
)

var backendConnection net.Conn

func writeToBackend(message string) {
	_, err := backendConnection.Write([]byte(message))
	if err != nil {
		fmt.Println("Error writing to client: ", err.Error())
		return
	}
}

func acceptBackend(backend net.Listener) (net.Conn, error) {
	back, err := backend.Accept()
	if err != nil {
		fmt.Println("Error accepting: ", err.Error())
		return nil, err
	}
	return back, nil
}


func main() {
	fmt.Println("Server Running...")
	server, err := net.Listen(SERVER_TYPE, SERVER_HOST+":"+SERVER_PORT)
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}

	defer server.Close()
	fmt.Println("Listening on " + server.Addr().String())
	fmt.Println("Waiting for client...")

	rng := fname.NewGenerator()
	mp := make(map[net.Conn]string)

	backend, err := net.Listen(SERVER_TYPE, SERVER_HOST+":"+BACKEND_PORT)
	if err != nil {
		fmt.Println("Error with Web Backend:", err.Error())
	}

	defer backend.Close()
	fmt.Println("Backend Listening on " + backend.Addr().String())

	backendConnection, err = acceptBackend(backend)

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
		connection.Write([]byte(fmt.Sprintf("Welcome to the chat %v\n\n", mp[connection])))

		writeToBackend(fmt.Sprintf("%v joined the chat\n", mp[connection]))
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
			fmt.Println("Connection Ended gracefully with " + mp[connection])
			writeToBackend(fmt.Sprintf("%v left the chat\n", mp[connection]))
			return
		}

		fmt.Printf("%v: %v", mp[connection], string(buffer[:mLen]))

		writeToBackend(fmt.Sprintf("%v: %v", mp[connection], string(buffer[:mLen])))
	}
}
