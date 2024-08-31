package client

import (
	"net"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

const (
	SERVER_PORT = "9988"
	SERVER_TYPE = "tcp"
)

func CreateClient() (net.Conn, error) {
	rootDir, _ := filepath.Abs("../")
	godotenv.Load(filepath.Join(rootDir, ".env"))
	SERVER_IP := os.Getenv("SERVER_IP")

	//establish connection
	connection, err := net.Dial(SERVER_TYPE, SERVER_IP+":"+SERVER_PORT)
	if err != nil {
		panic(err)
	}

	return connection, err
}

// send message to the server
func SendMessage(connection net.Conn, message string) {
	_, err := connection.Write([]byte(message + "\n"))
	if err != nil {
		panic(err)
	}
}
