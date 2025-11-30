import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./socket/initSocket";
import dotenv from "dotenv";

dotenv.config();



const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

//  Initialize Socket.IO
initSocket(server);

// Connect to MongoDB
connectDB();

// start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
