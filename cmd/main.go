package main

import (
	"io"
	"math/rand"
	"net"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func getMessages(connection net.Conn) (string, bool) {
	buffer := make([]byte, 1024)
	mLen, err := connection.Read(buffer)
	if err != nil {
		return "Error reading: " + err.Error(), false
	}
	return string(buffer[:mLen]), true
}

func makeConnection() (net.Conn, error) {
	IP := os.Getenv("SERVER_IP")
	connection, err := net.Dial("tcp", IP+":9989")
	return connection, err
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())
	r.GET("/random-string", func(c *gin.Context) {
		connection, err := makeConnection()
		if err != nil {
			c.JSON(500, gin.H{"error": "Error connecting to server"})
			return
		}

		c.Stream(func(w io.Writer) bool {
			message, ret := getMessages(connection)
			c.SSEvent("message", message)
			return ret
		})
		time.Sleep(60 * time.Second)
	})

	r.Run(":8080")
}

func generateRandomString() string {
	time.Sleep(1 * time.Second)
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, 10)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}
