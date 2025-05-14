const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// Create an Express app
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create an HTTP server using the Express app
const server = http.createServer(app);


// Create a WebSocket server by attaching it to the HTTP server
const wss = new WebSocket.Server({ server });

// Store all connected clients
const clients = new Set();

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  
  // Add the client to our set
  clients.add(ws);
  
  // Handle messages from clients
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // Broadcast to all clients except the sender
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
    clients.delete(ws);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}`);
});
