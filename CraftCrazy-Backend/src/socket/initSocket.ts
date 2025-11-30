// socket/initSocket.ts
import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import dotenv from "dotenv";

let io: Server;
dotenv.config();

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ADMIN_PANEL_URL, // you can restrict to your admin panel domain
      methods: ["GET", "POST","PATCH"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New Client Connected:", socket.id);

    // when admin triggers message
    socket.on("admin-message", (data) => {
      console.log("Admin Sent:", data);
      io.emit("broadcast-message", data); // broadcast to all panel clients
    });

    // when order is placed from admin panel user
    socket.on("order-created", (orderData) => {
      console.log("New Order Created:", orderData);
      io.emit("order-updated", orderData); //send update to admin panel UI
      io.emit("trend:update");  
    });

    socket.on("searching-adminData", (data)=> {
      io.emit("search_result",data);
    });

    //for contact 
    socket.on("contact-created",(data)=> {
      io.emit("contact-updated",data);
    });

    socket.on("disconnect", () => {
      console.log("Client Disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;
