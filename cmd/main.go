package main

import (
	"io"
	"net"
	"os"
	"path/filepath"
	"socketRTC/client"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// getMessages reads messages from the server
// return a false when error is encountered... mostly for EOF
func getMessages(connection net.Conn) (string, bool) {
	buffer := make([]byte, 1024)
	mLen, err := connection.Read(buffer)
	if err != nil {
		return "Error reading: " + err.Error(), false
	}
	return string(buffer[:mLen]), true
}

// creates a connection to the server
func makeConnection() (net.Conn, error) {
	IP := os.Getenv("SERVER_IP") // Get the server IP from the .env file
	connection, err := net.Dial("tcp", IP+":9989")
	return connection, err
}

func main() {
	rootDir, _ := filepath.Abs("../")
	godotenv.Load(filepath.Join(rootDir, ".env"))
	r := gin.Default()
	r.Use(cors.Default())

	// create a client instance
	clientInstance, err := client.CreateClient()
	if err != nil {
		panic(err)
	}

	r.GET("/", func(c *gin.Context) {
		c.File("index.html")
	})

	// SSE endpoint
	r.GET("/random-string", func(c *gin.Context) {
		connection, err := makeConnection()
		if err != nil {
			c.JSON(500, gin.H{"error": "Error connecting to server"})
			return
		}

		// Stop the connection when the server disconnects
		c.Stream(func(w io.Writer) bool {
			message, ret := getMessages(connection)
			c.SSEvent("message", message)
			return ret
		})

		// Sleep
		// time.Sleep(60 * time.Second)
	})

	r.POST("/send-message", func(c *gin.Context) {
		type request struct {
			Message string `json:"message"`
		}

		var req request

		c.BindJSON(&req)
		c.JSON(200, gin.H{"message": req.Message})
		client.SendMessage(clientInstance, req.Message)
	})

	port := os.Getenv("PORT")
	if port == "" {				
		port = "8080" // Default port if not set
	}

	// Start the server
	r.Run(":" + port)
}
